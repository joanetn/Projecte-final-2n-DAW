<?php

namespace App\Modules\User\Domain\Repositories;

use App\Modules\User\Domain\Entities\UserRol;

interface UserRolRepositoryInterface
{
    public function findById(string $id): ?UserRol;

    public function findByUser(string $usuariId): array;

    public function create(array $data): UserRol;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;

    public function findByRol(string $rol): array;
}
