<?php

/**
 * Mapper de PartitJugador: Model Eloquent → Entitat de Domini.
 *
 * Transforma el model Eloquent a entitat de domini pura.
 * Permet que el domini no depengui de la capa de persistència.
 */

namespace App\Modules\Lineup\Infrastructure\Persistence\Mappers;

use App\Modules\Lineup\Infrastructure\Persistence\Eloquent\Models\PartitJugadorModel;
use App\Modules\Lineup\Domain\Entities\PartitJugador;

class PartitJugadorMapper
{
    /**
     * Converteix un model Eloquent a entitat de domini.
     * Carrega relacions només si estan disponibles.
     */
    public function toDomain(PartitJugadorModel $model): PartitJugador
    {
        return new PartitJugador(
            id: $model->id,
            partitId: $model->partitId,
            jugadorId: $model->jugadorId,
            equipId: $model->equipId,
            punts: $model->punts,
            isActive: $model->isActive,
            // Relacions carregades sota demanda
            partit: $model->relationLoaded('partit') ? $model->partit : null,
            jugador: $model->relationLoaded('jugador') ? $model->jugador : null,
            equip: $model->relationLoaded('equip') ? $model->equip : null
        );
    }

    /**
     * Converteix una entitat de domini a array per persistir amb Eloquent.
     */
    public function toModel(PartitJugador $entity): array
    {
        return [
            'id' => $entity->id,
            'partitId' => $entity->partitId,
            'jugadorId' => $entity->jugadorId,
            'equipId' => $entity->equipId,
            'punts' => $entity->punts,
            'isActive' => $entity->isActive,
        ];
    }
}
