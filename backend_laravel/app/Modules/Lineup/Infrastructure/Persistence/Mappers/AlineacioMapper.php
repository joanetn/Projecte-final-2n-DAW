<?php

/**
 * Mapper d'Alineació: Model Eloquent → Entitat de Domini.
 *
 * Transforma el model Eloquent de la capa d'infraestructura
 * a l'entitat de domini pura. Manté la separació entre capes
 * (el domini no coneix Eloquent ni la base de dades).
 */

namespace App\Modules\Lineup\Infrastructure\Persistence\Mappers;

use App\Modules\Lineup\Infrastructure\Persistence\Eloquent\Models\AlineacioModel;
use App\Modules\Lineup\Domain\Entities\Alineacio;

class AlineacioMapper
{
    /**
     * Converteix un model Eloquent a entitat de domini.
     * Carrega les relacions només si ja estan disponibles (lazy loading evitat).
     */
    public function toDomain(AlineacioModel $model): Alineacio
    {
        return new Alineacio(
            id: $model->id,
            partitId: $model->partitId,
            jugadorId: $model->jugadorId,
            equipId: $model->equipId,
            posicio: $model->posicio,
            isActive: $model->isActive,
            creadaAt: $model->creada_at?->toIso8601String(),
            // Relacions carregades sota demanda (relationLoaded evita N+1 queries)
            partit: $model->relationLoaded('partit') ? $model->partit : null,
            jugador: $model->relationLoaded('jugador') ? $model->jugador : null,
            equip: $model->relationLoaded('equip') ? $model->equip : null
        );
    }

    /**
     * Converteix una entitat de domini a array per persistir amb Eloquent.
     */
    public function toModel(Alineacio $entity): array
    {
        return [
            'id' => $entity->id,
            'partitId' => $entity->partitId,
            'jugadorId' => $entity->jugadorId,
            'equipId' => $entity->equipId,
            'posicio' => $entity->posicio,
            'isActive' => $entity->isActive,
        ];
    }
}
