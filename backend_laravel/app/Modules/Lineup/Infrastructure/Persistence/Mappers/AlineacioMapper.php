<?php
namespace App\Modules\Lineup\Infrastructure\Persistence\Mappers;
use App\Modules\Lineup\Infrastructure\Persistence\Eloquent\Models\AlineacioModel;
use App\Modules\Lineup\Domain\Entities\Alineacio;
class AlineacioMapper
{
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
            partit: $model->relationLoaded('partit') ? $model->partit : null,
            jugador: $model->relationLoaded('jugador') ? $model->jugador : null,
            equip: $model->relationLoaded('equip') ? $model->equip : null
        );
    }
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
