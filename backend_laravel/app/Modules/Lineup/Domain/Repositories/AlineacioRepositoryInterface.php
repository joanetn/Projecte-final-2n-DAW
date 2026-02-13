<?php
namespace App\Modules\Lineup\Domain\Repositories;
use App\Modules\Lineup\Domain\Entities\Alineacio;
interface AlineacioRepositoryInterface
{
    public function findById(string $id): ?Alineacio;
    public function findByIdWithRelations(string $id, array $relations): ?Alineacio;
    public function findAll(): array;
    public function create(array $data): Alineacio;
    public function update(string $id, array $data): bool;
    public function delete(string $id): bool;
    public function findByPartit(string $partitId): array;
    public function findByEquip(string $equipId): array;
    public function findByJugador(string $jugadorId): array;
    public function findByPartitAndEquip(string $partitId, string $equipId): array;
}
