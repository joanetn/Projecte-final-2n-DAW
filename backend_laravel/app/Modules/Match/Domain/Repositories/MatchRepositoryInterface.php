<?php

namespace App\Modules\Match\Domain\Repositories;

use App\Modules\Match\Domain\Entities\Matches;

interface MatchRepositoryInterface
{
    public function findById(string $id): ?Matches;

    public function findByIdWithRelations(string $id, array $relations): ?Matches;

    public function findAll(): array;

    public function create(array $data): Matches;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;

    public function findByJornada(string $jornadaId): array;

    public function findByEquip(string $equipId): array;

    public function findByArbitre(string $arbitreId): array;
    public function findByIdIncludingInactive(string $id): ?Matches;
    public function findAllIncludingInactive(): array;
    public function findByIdIncludingInactiveWithRelations(string $id, array $relations): ?Matches;
}
