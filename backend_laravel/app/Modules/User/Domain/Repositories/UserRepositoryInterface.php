<?php

namespace App\Modules\User\Domain\Repositories;

use App\Modules\User\Domain\Entities\User;

interface UserRepositoryInterface
{
    public function findById(string $id): ?User;

    public function findByEmail(string $email): array;

    public function findByIdWithRelations(string $id, array $relations);

    public function findAll(): array;

    public function findAllWithRelations(array $relations): array;

    public function findAllIncludingInactive(): array;

    public function findAllIncludingInactiveWithRelations(array $relations): array;

    public function findByIdIncludingInactive(string $id): ?User;

    public function findByIdIncludingInactiveWithRelations(string $id, array $relations): ?User;

    public function create(array $data): User;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;

    public function findByLevel(string $level): array;

    public function searchWithFilters(
        ?string $q,
        ?string $nivell,
        string $sort,
        int $page,
        int $limit
    ): array;
}
