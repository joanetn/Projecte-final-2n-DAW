<?php

namespace App\Modules\Club\Infrastructure\Persistence\Mappers;

use App\Modules\Club\Domain\Entities\Club;
use App\Modules\Club\Infrastructure\Persistence\Eloquent\Models\ClubModel;

class ClubMapper
{
    public static function toDomain(ClubModel $model): Club
    {
        return new Club(
            id: $model->id,
            nom: $model->nom,
            descripcio: $model->descripcio,
            adreca: $model->adreca,
            ciutat: $model->ciutat,
            codiPostal: $model->codiPostal,
            provincia: $model->provincia,
            telefon: $model->telefon,
            email: $model->email,
            web: $model->web,
            anyFundacio: $model->anyFundacio,
            creadorId: $model->creadorId,
            isActive: $model->isActive,
            createdAt: $model->created_at?->format('Y-m-d H:i:s'),
            updatedAt: $model->updated_at?->format('Y-m-d H:i:s'),
        );
    }

    public static function toArray(Club $club): array
    {
        return [
            'id' => $club->id,
            'nom' => $club->nom,
            'descripcio' => $club->descripcio,
            'adreca' => $club->adreca,
            'ciutat' => $club->ciutat,
            'codiPostal' => $club->codiPostal,
            'provincia' => $club->provincia,
            'telefon' => $club->telefon,
            'email' => $club->email,
            'web' => $club->web,
            'anyFundacio' => $club->anyFundacio,
            'creadorId' => $club->creadorId,
            'isActive' => $club->isActive,
            'createdAt' => $club->createdAt,
            'updatedAt' => $club->updatedAt,
        ];
    }
}
