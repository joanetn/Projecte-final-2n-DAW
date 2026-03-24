<?php

namespace App\Modules\Merchandise\Infrastructure\Persistence\Mappers;

use App\Modules\Merchandise\Domain\Entities\CartItem;
use App\Modules\Merchandise\Infrastructure\Persistence\Eloquent\Models\CartItemModel;

class CartItemMapper
{
    public static function toDomain(CartItemModel $model): CartItem
    {
        $merch = null;

        if ($model->relationLoaded('merch') && $model->merch) {
            $merch = [
                'id' => $model->merch->id,
                'nom' => $model->merch->nom,
                'marca' => $model->merch->marca,
                'imageUrl' => $model->merch->imageUrl,
                'preu' => $model->merch->preu,
                'stock' => $model->merch->stock,
                'isActive' => $model->merch->isActive,
            ];
        }

        return new CartItem(
            id: $model->id,
            cartId: $model->cartId,
            merchId: $model->merchId,
            quantitat: (int) $model->quantitat,
            isActive: $model->isActive ?? true,
            createdAt: $model->created_at?->toISOString(),
            updatedAt: $model->updated_at?->toISOString(),
            merch: $merch,
        );
    }

    public static function toArray(CartItem $entity): array
    {
        return [
            'id' => $entity->id,
            'cartId' => $entity->cartId,
            'merchId' => $entity->merchId,
            'quantitat' => $entity->quantitat,
            'isActive' => $entity->isActive,
        ];
    }
}
