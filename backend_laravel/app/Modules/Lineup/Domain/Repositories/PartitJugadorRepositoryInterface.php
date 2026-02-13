<?php
namespace App\Modules\Lineup\Domain\Repositories;
use App\Modules\Lineup\Domain\Entities\PartitJugador;
interface PartitJugadorRepositoryInterface
{
    public function findById(string $id): ?PartitJugador;
    public function findByIdWithRelations(string $id, array $relations): ?PartitJugador;
    public function findAll(): array;
    public function create(array $data): PartitJugador;
    public function update(string $id, array $data): bool;
    public function delete(string $id): bool;
    public function findByPartit(string $partitId): array;
    public function findByJugador(string $jugadorId): array;
    public function findByPartitAndEquip(string $partitId, string $equipId): array;
}
