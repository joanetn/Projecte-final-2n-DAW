<?php

/**
 * Mapper d'Instal·lació: converteix entre Eloquent Model i Entitat de Domini.
 *
 * El Mapper és el pont entre la capa d'Infraestructura (Eloquent) i el Domini.
 * - toDomain(): Model Eloquent → Entitat de Domini (per queries/lectura)
 * - toArray(): Entitat de Domini → Array (per serialització/resposta)
 *
 * Això permet que el domini sigui independent d'Eloquent (DDD).
 */

namespace App\Modules\Venue\Infrastructure\Persistence\Mappers;

use App\Modules\Venue\Domain\Entities\Instalacio;
use App\Modules\Venue\Infrastructure\Persistence\Eloquent\Models\InstalacioModel;

class InstalacioMapper
{
    /**
     * Converteix un Model Eloquent a Entitat de Domini.
     * Mapeja els noms de camps d'Eloquent (created_at) als del domini (createdAt).
     */
    public static function toDomain(InstalacioModel $model): Instalacio
    {
        return new Instalacio(
            id: $model->id,
            nom: $model->nom,
            adreca: $model->adreca,
            telefon: $model->telefon,
            tipusPista: $model->tipusPista,
            numPistes: $model->numPistes,
            clubId: $model->clubId,
            isActive: $model->isActive,
            createdAt: $model->created_at?->format('Y-m-d H:i:s'),
            updatedAt: $model->updated_at?->format('Y-m-d H:i:s'),
        );
    }

    /**
     * Converteix una Entitat de Domini a array per serialitzar.
     */
    public static function toArray(Instalacio $instalacio): array
    {
        return [
            'id' => $instalacio->id,
            'nom' => $instalacio->nom,
            'adreca' => $instalacio->adreca,
            'telefon' => $instalacio->telefon,
            'tipusPista' => $instalacio->tipusPista,
            'numPistes' => $instalacio->numPistes,
            'clubId' => $instalacio->clubId,
            'isActive' => $instalacio->isActive,
            'createdAt' => $instalacio->createdAt,
            'updatedAt' => $instalacio->updatedAt,
        ];
    }
}
