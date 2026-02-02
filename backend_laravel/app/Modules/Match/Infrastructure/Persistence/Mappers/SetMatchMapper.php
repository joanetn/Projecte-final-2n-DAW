<?php

namespace App\Modules\Match\Infrastructure\Persistence\Mappers;

use App\Modules\Match\Domain\Entities\MatchSet;
use App\Modules\Match\Infrastructure\Persistence\Eloquent\Models\SetMatchModel;

class SetMatchMapper
{
    public function toDomain(SetMatchModel $model): MatchSet
    {
        return new MatchSet(
            id: $model->id,
            partitId: $model->partitId,
            numeroSet: $model->numeroSet,
            jocsLocal: $model->jocsLocal,
            jocsVisit: $model->jocsVisit,
            tiebreak: $model->tiebreak,
            puntsLocalTiebreak: $model->puntsLocalTiebreak,
            puntsVisitTiebreak: $model->puntsVisitTiebreak
        );
    }

    public function toModel(MatchSet $entity): array
    {
        return [
            'id' => $entity->id,
            'partitId' => $entity->partitId,
            'numeroSet' => $entity->numeroSet,
            'jocsLocal' => $entity->jocsLocal,
            'jocsVisit' => $entity->jocsVisit,
            'tiebreak' => $entity->tiebreak,
            'puntsLocalTiebreak' => $entity->puntsLocalTiebreak,
            'puntsVisitTiebreak' => $entity->puntsVisitTiebreak,
        ];
    }
}
