<?php

namespace App\Modules\Merchandise\Infrastructure\Persistence\Mappers;

use App\Modules\Merchandise\Domain\Entities\Compra;
use App\Modules\Merchandise\Infrastructure\Persistence\Eloquent\Models\CompraModel;

class CompraMapper
{
    public static function toDomain(CompraModel $model): Compra
    {
        $usuari = null;
        $merch = null;

        if ($model->relationLoaded('usuari') && $model->usuari) {
            $usuari = [
                'id' => $model->usuari->id,
                'nom' => $model->usuari->nom,
                'email' => $model->usuari->email,
            ];
        }

        if ($model->relationLoaded('merch') && $model->merch) {
            $merch = [
                'id' => $model->merch->id,
                'nom' => $model->merch->nom,
                'preu' => $model->merch->preu,
            ];
        }

        return new Compra(
            id: $model->id,
            usuariId: $model->usuariId,
            merchId: $model->merchId,
            quantitat: $model->quantitat,
            total: $model->total,
            pagat: $model->pagat,
            status: $model->status,
            isActive: $model->isActive,
            createdAt: $model->created_at?->toISOString(),
            usuari: $usuari,
            merch: $merch,
        );
    }

    public static function toArray(Compra $entity): array
    {
        return [
            'id' => $entity->id,
            'usuariId' => $entity->usuariId,
            'merchId' => $entity->merchId,
            'quantitat' => $entity->quantitat,
            'total' => $entity->total,
            'pagat' => $entity->pagat,
            'status' => $entity->status,
            'isActive' => $entity->isActive,
        ];
    }
}
