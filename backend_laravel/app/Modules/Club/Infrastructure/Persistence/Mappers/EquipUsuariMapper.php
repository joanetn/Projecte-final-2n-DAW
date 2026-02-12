<?php

namespace App\Modules\Club\Infrastructure\Persistence\Mappers;

use App\Modules\Club\Domain\Entities\EquipUsuari;
use App\Modules\Club\Infrastructure\Persistence\Eloquent\Models\EquipUsuariModel;

class EquipUsuariMapper
{
    public function toDomain(EquipUsuariModel $model): EquipUsuari
    {
        return new EquipUsuari(
            id: $model->id,
            equipId: $model->equipId,
            usuariId: $model->usuariId,
            rolEquip: $model->rolEquip,
            isActive: $model->isActive,
            createdAt: $model->created_at?->format('Y-m-d H:i:s'),
        );
    }

    public function toModel(EquipUsuari $entity): array
    {
        return [
            'id' => $entity->id,
            'equipId' => $entity->equipId,
            'usuariId' => $entity->usuariId,
            'rolEquip' => $entity->rolEquip,
            'isActive' => $entity->isActive,
            'created_at' => $entity->createdAt,
        ];
    }
}
