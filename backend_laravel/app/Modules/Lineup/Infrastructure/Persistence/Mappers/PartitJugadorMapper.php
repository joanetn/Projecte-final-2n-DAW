<?php
namespace App\Modules\Lineup\Infrastructure\Persistence\Mappers;
use App\Modules\Lineup\Infrastructure\Persistence\Eloquent\Models\PartitJugadorModel;
use App\Modules\Lineup\Domain\Entities\PartitJugador;
class PartitJugadorMapper
{
    public function toDomain(PartitJugadorModel $model): PartitJugador
    {
        return new PartitJugador(
            id: $model->id,
            partitId: $model->partitId,
            jugadorId: $model->jugadorId,
            equipId: $model->equipId,
            punts: $model->punts,
            isActive: $model->isActive,
            partit: $model->relationLoaded('partit') ? $model->partit : null,
            jugador: $model->relationLoaded('jugador') ? $model->jugador : null,
            equip: $model->relationLoaded('equip') ? $model->equip : null
        );
    }
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
