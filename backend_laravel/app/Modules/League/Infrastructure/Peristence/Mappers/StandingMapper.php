<?php

namespace App\Modules\League\Infrastructure\Peristence\Mappers;

use App\Modules\League\Domain\Entities\Standing;
use App\Modules\League\Infrastructure\Peristence\Eloquent\Models\StandingModel;

class StandingMapper
{
    public function toDomain(StandingModel $standingModel): Standing
    {
        return new Standing(
            id: $standingModel->id,
            lligaId: $standingModel->lligaId,
            equipId: $standingModel->equipId,
            partitsJugats: $standingModel->partitsJugats,
            partitsGuanyats: $standingModel->partitsGuanyats,
            setsGuanyats: $standingModel->setsGuanyats,
            setPerduts: $standingModel->setPerduts,
            jocsGuanyats: $standingModel->jocsGuanyats,
            jocsPerduts: $standingModel->jocsPerduts,
            punts: $standingModel->punts,
            isActive: $standingModel->isActive,
            createdAt: $standingModel->created_at->toIso8601String(),
            updatedAt: $standingModel->updated_at->toIso8601String(),
            lliga: $standingModel->relationLoaded('lliga') ? $standingModel->lliga : null,
            equip: $standingModel->relationLoaded('equip') ? $standingModel->equip : null
        );
    }

    public function toModel(Standing $standing): array
    {
        return [
            'id' => $standing->id,
            'lligaId' => $standing->lligaId,
            'equipId' => $standing->equipId,
            'partitsJugats' => $standing->partitsJugats,
            'partitsGuanyats' => $standing->partitsGuanyats,
            'setsGuanyats' => $standing->setsGuanyats,
            'setPerduts' => $standing->setPerduts,
            'jocsGuanyats' => $standing->jocsGuanyats,
            'jocsPerduts' => $standing->jocsPerduts,
            'punts' => $standing->punts,
            'isActive' => $standing->isActive,
        ];
    }
}
