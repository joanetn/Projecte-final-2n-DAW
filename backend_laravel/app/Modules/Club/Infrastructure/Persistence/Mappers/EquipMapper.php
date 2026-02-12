<?php

namespace App\Modules\Club\Infrastructure\Persistence\Mappers;

use App\Modules\Club\Domain\Entities\Equip;
use App\Modules\Club\Infrastructure\Persistence\Eloquent\Models\EquipModel;

class EquipMapper
{
    public static function toDomain(EquipModel $model): Equip
    {
        return new Equip(
            id: $model->id,
            nom: $model->nom,
            categoria: $model->categoria,
            clubId: $model->clubId,
            lligaId: $model->lligaId,
            isActive: $model->isActive,
            createdAt: $model->created_at?->format('Y-m-d H:i:s'),
            updatedAt: $model->updated_at?->format('Y-m-d H:i:s'),
        );
    }

    public static function toArray(Equip $equip): array
    {
        return [
            'id' => $equip->id,
            'nom' => $equip->nom,
            'categoria' => $equip->categoria,
            'clubId' => $equip->clubId,
            'lligaId' => $equip->lligaId,
            'isActive' => $equip->isActive,
            'createdAt' => $equip->createdAt,
            'updatedAt' => $equip->updatedAt,
        ];
    }
}
