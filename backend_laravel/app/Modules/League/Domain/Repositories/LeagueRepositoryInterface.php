<?php

namespace App\Modules\League\Domain\Repositories;

use App\Modules\League\Domain\Entities\League;

interface LeagueRepositoryInterface
{
    public function findById(string $id): ?League;

    public function findByIdWithRelations(string $id, array $relations): ?League;

    public function findAll(): array;

    public function create(array $data): League;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;

    public function findByCategoria(string $categoria): array;
}
