<?php

namespace App\Modules\Merchandise\Infrastructure\Persistence\Mappers;

use App\Modules\Merchandise\Domain\Entities\Merch;
use App\Modules\Merchandise\Infrastructure\Persistence\Eloquent\Models\MerchModel;

class MerchMapper
{
    public static function toDomain(MerchModel $model): Merch
    {
        $compras = null;

        if ($model->relationLoaded('compras')) {
            $compras = $model->compras->map(function ($compra) {
                return [
                    'id' => $compra->id,
                    'usuariId' => $compra->usuariId,
                    'quantitat' => $compra->quantitat,
                    'total' => $compra->total,
                    'pagat' => $compra->pagat,
                    'status' => $compra->status,
                ];
            })->toArray();
        }

        return new Merch(
            id: $model->id,
            nom: $model->nom,
            marca: $model->marca,
            preu: $model->preu,
            stock: $model->stock,
            isActive: $model->isActive,
            createdAt: $model->created_at?->toISOString(),
            updatedAt: $model->updated_at?->toISOString(),
            compras: $compras,
        );
    }

    public static function toArray(Merch $entity): array
    {
        return [
            'id' => $entity->id,
            'nom' => $entity->nom,
            'marca' => $entity->marca,
            'preu' => $entity->preu,
            'stock' => $entity->stock,
            'isActive' => $entity->isActive,
        ];
    }
}
