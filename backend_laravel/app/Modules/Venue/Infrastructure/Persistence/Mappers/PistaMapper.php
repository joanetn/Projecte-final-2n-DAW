<?php

namespace App\Modules\Venue\Infrastructure\Persistence\Mappers;

use App\Modules\Venue\Domain\Entities\Pista;
use App\Modules\Venue\Infrastructure\Persistence\Eloquent\Models\PistaModel;

class PistaMapper
{
    public static function toDomain(PistaModel $model): Pista
    {
        return new Pista(
            id: $model->id,
            nom: $model->nom,
            tipus: $model->tipus,
            instalacioId: $model->instalacioId,
            isActive: $model->isActive,
            createdAt: $model->created_at?->format('Y-m-d H:i:s'),
            updatedAt: $model->updated_at?->format('Y-m-d H:i:s'),
        );
    }

    public static function toArray(Pista $pista): array
    {
        return [
            'id' => $pista->id,
            'nom' => $pista->nom,
            'tipus' => $pista->tipus,
            'instalacioId' => $pista->instalacioId,
            'isActive' => $pista->isActive,
            'createdAt' => $pista->createdAt,
            'updatedAt' => $pista->updatedAt,
        ];
    }
}
