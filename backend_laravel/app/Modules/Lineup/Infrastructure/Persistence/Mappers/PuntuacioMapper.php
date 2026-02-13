<?php

/**
 * Mapper de Puntuació: Model Eloquent → Entitat de Domini.
 *
 * Transforma el model Eloquent a entitat de domini pura.
 * Desacobla la capa de domini de la capa d'infraestructura.
 */

namespace App\Modules\Lineup\Infrastructure\Persistence\Mappers;

use App\Modules\Lineup\Infrastructure\Persistence\Eloquent\Models\PuntuacioModel;
use App\Modules\Lineup\Domain\Entities\Puntuacio;

class PuntuacioMapper
{
    /**
     * Converteix un model Eloquent a entitat de domini.
     * Carrega relacions només si estan disponibles.
     */
    public function toDomain(PuntuacioModel $model): Puntuacio
    {
        return new Puntuacio(
            id: $model->id,
            partitId: $model->partitId,
            jugadorId: $model->jugadorId,
            punts: $model->punts,
            isActive: $model->isActive,
            // Relacions carregades sota demanda
            partit: $model->relationLoaded('partit') ? $model->partit : null,
            jugador: $model->relationLoaded('jugador') ? $model->jugador : null
        );
    }

    /**
     * Converteix una entitat de domini a array per persistir amb Eloquent.
     */
    public function toModel(Puntuacio $entity): array
    {
        return [
            'id' => $entity->id,
            'partitId' => $entity->partitId,
            'jugadorId' => $entity->jugadorId,
            'punts' => $entity->punts,
            'isActive' => $entity->isActive,
        ];
    }
}
