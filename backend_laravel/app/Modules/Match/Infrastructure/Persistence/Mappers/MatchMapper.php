<?php

namespace App\Modules\Match\Infrastructure\Persistence\Mappers;

use App\Modules\Match\Infrastructure\Persistence\Eloquent\Models\MatchModel;
use App\Modules\Match\Domain\Entities\Matches;

class MatchMapper
{
    public function toDomain(MatchModel $model): Matches
    {
        return new Matches(
            id: $model->id,
            jornadaId: $model->jornadaId,
            localId: $model->localId,
            visitantId: $model->visitantId,
            dataHora: $model->dataHora?->toIso8601String(),
            pistaId: $model->pistaId,
            arbitreId: $model->arbitreId,
            status: $model->status,
            isActive: $model->isActive,
            createdAt: $model->created_at->toIso8601String(),
            updatedAt: $model->updated_at->toIso8601String(),
            setPartits: $model->relationLoaded('setPartits') ? $model->setPartits->toArray() : null,
            local: $model->relationLoaded('local') ? $model->local : null,
            visitant: $model->relationLoaded('visitant') ? $model->visitant : null,
            jornada: $model->relationLoaded('jornada') ? $model->jornada : null,
            pista: $model->relationLoaded('pista') ? $model->pista : null,
            arbitre: $model->relationLoaded('arbitre') ? $model->arbitre : null,
            acta: $model->relationLoaded('acta') ? $model->acta : null,
            alineacions: $model->relationLoaded('alineacions') ? $model->alineacions->toArray() : null
        );
    }

    public function toModel(Matches $entity): array
    {
        return [
            'id' => $entity->id,
            'jornadaId' => $entity->jornadaId,
            'localId' => $entity->localId,
            'visitantId' => $entity->visitantId,
            'dataHora' => $entity->dataHora,
            'pistaId' => $entity->pistaId,
            'arbitreId' => $entity->arbitreId,
            'status' => $entity->status,
            'isActive' => $entity->isActive,
        ];
    }
}
