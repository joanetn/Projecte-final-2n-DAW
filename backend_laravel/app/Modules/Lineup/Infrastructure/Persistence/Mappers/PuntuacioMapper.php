<?php
namespace App\Modules\Lineup\Infrastructure\Persistence\Mappers;
use App\Modules\Lineup\Infrastructure\Persistence\Eloquent\Models\PuntuacioModel;
use App\Modules\Lineup\Domain\Entities\Puntuacio;
class PuntuacioMapper
{
    public function toDomain(PuntuacioModel $model): Puntuacio
    {
        return new Puntuacio(
            id: $model->id,
            partitId: $model->partitId,
            jugadorId: $model->jugadorId,
            punts: $model->punts,
            isActive: $model->isActive,
            partit: $model->relationLoaded('partit') ? $model->partit : null,
            jugador: $model->relationLoaded('jugador') ? $model->jugador : null
        );
    }
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
