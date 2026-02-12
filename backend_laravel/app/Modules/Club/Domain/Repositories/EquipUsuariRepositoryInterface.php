<?php

namespace App\Modules\Club\Domain\Repositories;

use App\Modules\Club\Domain\Entities\EquipUsuari;

interface EquipUsuariRepositoryInterface
{
    public function findById(string $id): ?EquipUsuari;

    public function findByEquipId(string $equipId): array;

    public function findByUsuariId(string $usuariId): array;

    public function findByEquipIdAndUsuariId(string $equipId, string $usuariId): ?EquipUsuari;

    public function create(array $data): EquipUsuari;

    public function update(string $id, array $data): bool;
    public function delete(string $id): bool;
    public function findByRolEquip(string $equipId, string $rolEquip): array;
}
