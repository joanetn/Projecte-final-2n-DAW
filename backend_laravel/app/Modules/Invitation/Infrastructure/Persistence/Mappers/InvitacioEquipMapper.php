<?php

namespace App\Modules\Invitation\Infrastructure\Persistence\Mappers;

use App\Modules\Invitation\Domain\Entities\InvitacioEquip;
use App\Modules\Invitation\Infrastructure\Persistence\Eloquent\Models\InvitacioEquipModel;

class InvitacioEquipMapper
{
    public static function toDomain(InvitacioEquipModel $model): InvitacioEquip
    {
        return new InvitacioEquip(
            id: $model->id,
            equipId: $model->equipId,
            usuariId: $model->usuariId,
            missatge: $model->missatge,
            estat: $model->estat,
            isActive: $model->isActive,
            createdAt: $model->created_at?->format('Y-m-d H:i:s'),
            updatedAt: $model->updated_at?->format('Y-m-d H:i:s'),
            equip: $model->relationLoaded('equip') ? $model->equip : null,
            usuari: $model->relationLoaded('usuari') ? $model->usuari : null,
        );
    }

    public static function toArray(InvitacioEquip $invitacio): array
    {
        return [
            'id' => $invitacio->id,
            'equipId' => $invitacio->equipId,
            'usuariId' => $invitacio->usuariId,
            'missatge' => $invitacio->missatge,
            'estat' => $invitacio->estat,
            'isActive' => $invitacio->isActive,
            'createdAt' => $invitacio->createdAt,
            'updatedAt' => $invitacio->updatedAt,
        ];
    }
}
