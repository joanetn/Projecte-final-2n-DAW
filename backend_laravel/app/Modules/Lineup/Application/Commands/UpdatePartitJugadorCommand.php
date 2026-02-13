<?php
namespace App\Modules\Lineup\Application\Commands;
use App\Modules\Lineup\Application\DTOs\UpdatePartitJugadorDTO;
use App\Modules\Lineup\Domain\Repositories\PartitJugadorRepositoryInterface;
use App\Modules\Lineup\Domain\Exceptions\PartitJugadorNotFoundException;
class UpdatePartitJugadorCommand
{
    public function __construct(
        private PartitJugadorRepositoryInterface $partitJugadorRepo
    ) {}
    public function execute(string $partitJugadorId, UpdatePartitJugadorDTO $dto): void
    {
        $partitJugador = $this->partitJugadorRepo->findById($partitJugadorId);
        if (!$partitJugador) {
            throw new PartitJugadorNotFoundException($partitJugadorId);
        }
        $updateData = array_filter([
            'punts' => $dto->punts,
            'isActive' => $dto->isActive,
        ], fn($value) => $value !== null);
        $this->partitJugadorRepo->update($partitJugadorId, $updateData);
    }
}
