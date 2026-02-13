<?php

namespace App\Modules\Invitation\Domain\Repositories;

use App\Modules\Invitation\Domain\Entities\InvitacioEquip;

interface InvitacioEquipRepositoryInterface
{
    public function findById(string $id): ?InvitacioEquip;

    public function findByIdWithRelations(string $id, array $relations): ?InvitacioEquip;

    public function findAll(): array;

    public function findAllWithRelations(array $relations): array;

    public function create(array $data): InvitacioEquip;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;

    public function findByEquip(string $equipId): array;

    public function findByUsuari(string $usuariId): array;

    public function findByEstat(string $estat): array;

    public function findPendentsByUsuari(string $usuariId): array;
}
