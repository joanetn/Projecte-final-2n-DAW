<?php

namespace App\Modules\League\Domain\Repositories;

use App\Modules\League\Domain\Entities\Standing;

interface StandingRepositoryInterface
{
    public function findById(string $id): ?Standing;

    public function findByIdWithRelations(string $id, array $relations): ?Standing;

    public function findAll(): array;

    public function create(array $data): Standing;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;

    public function findByLeague(string $lligaId): array;

    public function findByEquip(string $equipId): array;
}
