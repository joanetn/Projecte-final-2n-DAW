<?php

namespace App\Modules\Merchandise\Application\Commands;

use App\Modules\Merchandise\Application\DTOs\CreateCompraDTO;
use App\Modules\Merchandise\Domain\Exceptions\MerchNotFoundException;
use App\Modules\Merchandise\Domain\Repositories\CompraRepositoryInterface;
use App\Modules\Merchandise\Domain\Repositories\MerchRepositoryInterface;
use App\Modules\Merchandise\Domain\Services\MerchandiseDomainService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CreateCompraCommand
{
    private const MAX_RETRIES = 5;

    public function __construct(
        private CompraRepositoryInterface $compraRepository,
        private MerchRepositoryInterface $merchRepository,
        private MerchandiseDomainService $domainService,
    ) {}

    /**
     * Compra un producte de forma concurrent-safe:
     *  - SERIALIZABLE isolation level
     *  - FOR UPDATE NOWAIT → falla ràpid si un altre client té el lock
     *  - Reintenta automàticament fins MAX_RETRIES vegades en cas de
     *    serialization_failure (40001)
     */
    public function execute(CreateCompraDTO $dto): string
    {
        for ($attempt = 0; $attempt < self::MAX_RETRIES; $attempt++) {
            try {
                return $this->runAttempt($dto);
            } catch (\PDOException $e) {
                // serialization_failure → reintentar
                if ($e->getCode() === '40001' && $attempt < self::MAX_RETRIES - 1) {
                    continue;
                }
                // 55P03 (lock_not_available) o últim intent → propagar al controller
                throw $e;
            }
        }

        throw new \RuntimeException('Retry loop exhaurit sense resultat');
    }

    private function runAttempt(CreateCompraDTO $dto): string
    {
        DB::beginTransaction();

        try {
            // PostgreSQL permet SET TRANSACTION després de BEGIN i
            // abans del primer statement de dades
            DB::statement('SET TRANSACTION ISOLATION LEVEL SERIALIZABLE');

            // Bloqueig pessimista: NOWAIT falla immediatament (55P03)
            // si un altre usuari ja té el lock sobre la mateixa fila
            $merch = $this->merchRepository->findByIdWithLock($dto->merchId);

            if (!$merch) {
                DB::rollBack();
                throw new MerchNotFoundException($dto->merchId);
            }

            // Validació d'estoc sobre la fila bloquejada (no hi ha TOCTOU)
            $this->domainService->validateStock($merch, $dto->quantitat);

            $total = $dto->total ?? $this->domainService->calculateTotal($merch->preu ?? 0, $dto->quantitat);
            $id    = Str::uuid()->toString();

            $this->compraRepository->create([
                'id'        => $id,
                'usuariId'  => $dto->usuariId,
                'merchId'   => $dto->merchId,
                'quantitat' => $dto->quantitat,
                'total'     => $total,
                'pagat'     => false,
                'status'    => 'PENDENT',
                'isActive'  => true,
            ]);

            if ($merch->stock !== null) {
                // Decrement atòmic: el lock garanteix que ningú
                // ha modificat l'estoc des que ho hem llegit
                $this->merchRepository->update($merch->id, [
                    'stock' => $merch->stock - $dto->quantitat,
                ]);
            }

            DB::commit();
            return $id;
        } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
