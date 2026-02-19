<?php

namespace App\Modules\Club\Domain\Repositories;

use App\Modules\Club\Domain\Entities\Equip;

interface EquipRepositoryInterface
{
    public function findById(string $id): ?Equip;

    public function findByIdWithRelations(string $id, array $relations): ?Equip;

    public function findByClubId(string $clubId): array;

    public function findAll(): array;
    public function create(array $data): Equip;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;

    public function findByCategoria(string $categoria): array;

    public function findByIdIncludingInactive(string $id): ?Equip;

    public function findAllIncludingInactive(): array;
}
