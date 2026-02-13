<?php

namespace App\Modules\Merchandise\Application\Commands;

use App\Modules\Merchandise\Application\DTOs\CreateCompraDTO;
use App\Modules\Merchandise\Domain\Exceptions\MerchNotFoundException;
use App\Modules\Merchandise\Domain\Repositories\CompraRepositoryInterface;
use App\Modules\Merchandise\Domain\Repositories\MerchRepositoryInterface;
use App\Modules\Merchandise\Domain\Services\MerchandiseDomainService;
use Illuminate\Support\Str;

class CreateCompraCommand
{
    public function __construct(
        private CompraRepositoryInterface $compraRepository,
        private MerchRepositoryInterface $merchRepository,
        private MerchandiseDomainService $domainService,
    ) {}

    public function execute(CreateCompraDTO $dto): string
    {
        $merch = $this->merchRepository->findById($dto->merchId);

        if (!$merch) {
            throw new MerchNotFoundException($dto->merchId);
        }

        $this->domainService->validateStock($merch, $dto->quantitat);

        $total = $dto->total ?? $this->domainService->calculateTotal($merch->preu ?? 0, $dto->quantitat);

        $id = Str::uuid()->toString();

        $this->compraRepository->create([
            'id' => $id,
            'usuariId' => $dto->usuariId,
            'merchId' => $dto->merchId,
            'quantitat' => $dto->quantitat,
            'total' => $total,
            'pagat' => false,
            'status' => 'PENDENT',
            'isActive' => true,
        ]);

        if ($merch->stock !== null) {
            $this->merchRepository->update($merch->id, [
                'stock' => $merch->stock - $dto->quantitat,
            ]);
        }

        return $id;
    }
}
