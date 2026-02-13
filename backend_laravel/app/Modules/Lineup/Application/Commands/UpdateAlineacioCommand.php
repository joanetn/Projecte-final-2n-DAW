<?php
namespace App\Modules\Lineup\Application\Commands;
use App\Modules\Lineup\Application\DTOs\UpdateAlineacioDTO;
use App\Modules\Lineup\Domain\Repositories\AlineacioRepositoryInterface;
use App\Modules\Lineup\Domain\Services\LineupDomainService;
use App\Modules\Lineup\Domain\Exceptions\AlineacioNotFoundException;
class UpdateAlineacioCommand
{
    public function __construct(
        private AlineacioRepositoryInterface $alineacioRepo,
        private LineupDomainService $domainService
    ) {}
    public function execute(string $alineacioId, UpdateAlineacioDTO $dto): void
    {
        $alineacio = $this->alineacioRepo->findById($alineacioId);
        if (!$alineacio) {
            throw new AlineacioNotFoundException($alineacioId);
        }
        if (!$this->domainService->canModifyAlineacio($alineacio)) {
            throw new \Exception("No es pot modificar una alineació desactivada");
        }
        $updateData = array_filter([
            'posicio' => $dto->posicio,
            'isActive' => $dto->isActive,
        ], fn($value) => $value !== null);
        $this->alineacioRepo->update($alineacioId, $updateData);
    }
}
