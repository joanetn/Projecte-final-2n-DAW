<?php

namespace App\Modules\Club\Domain\Repositories;

use App\Modules\Club\Domain\Entities\Club;

interface ClubRepositoryInterface
{
    public function findById(string $id): ?Club;

    public function findByIdWithRelations(string $id, array $relations): ?Club;

    public function findAll(): array;

    public function findAllWithRelations(array $relations): array;

    public function create(array $data): Club;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;

    public function findByProvincia(string $provincia): array;

    public function findByIdIncludingInactive(string $id): ?Club;

    public function findAllIncludingInactive(): array;

    public function findByIdIncludingInactiveWithRelations(string $id, array $relations): ?Club;
}
