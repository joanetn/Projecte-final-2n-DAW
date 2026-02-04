<?php

namespace App\Modules\League\Domain\Repositories;

use App\Modules\League\Domain\Entities\Round;

interface RoundRepositoryInterface
{
    public function findById(string $id): ?Round;

    public function findByIdWithRelations(string $id, array $relations): ?Round;

    public function findAll(): array;

    public function create(array $data): Round;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;

    public function findByLeague(string $lligaId): array;

    public function findByStatus(string $status): array;
}
