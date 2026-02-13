<?php
namespace App\Modules\Lineup\Domain\Repositories;
use App\Modules\Lineup\Domain\Entities\Puntuacio;
interface PuntuacioRepositoryInterface
{
    public function findById(string $id): ?Puntuacio;
    public function findByIdWithRelations(string $id, array $relations): ?Puntuacio;
    public function findAll(): array;
    public function create(array $data): Puntuacio;
    public function update(string $id, array $data): bool;
    public function delete(string $id): bool;
    public function findByPartit(string $partitId): array;
    public function findByJugador(string $jugadorId): array;
    public function getRanking(): array;
}
