<?php

namespace Modules\Match\Domain\Repositories;

use Modules\Match\Domain\Entities\Matches;
use Illuminate\Pagination\LengthAwarePaginator;

interface MatchRepositoryInterface
{
    public function findById(string $id): ?Matches;

    public function findByIdWithRelations(string $id, array $relations): ?Matches;

    public function findAll(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function create(array $data): Matches;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;

    public function findByJornada(string $jornadaId): array;

    public function findByEquip(string $equipId): array;

    public function findByArbitre(string $arbitreId): array;
}