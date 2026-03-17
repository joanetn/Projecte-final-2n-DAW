<?php

namespace App\Modules\Merchandise\Infrastructure\Persistence\Mappers;

use App\Modules\Merchandise\Domain\Entities\Cart;
use App\Modules\Merchandise\Infrastructure\Persistence\Eloquent\Models\CartModel;

class CartMapper
{
    public static function toDomain(CartModel $model): Cart
    {
        $items = null;

        if ($model->relationLoaded('items')) {
            $items = $model->items
                ->map(function ($itemModel) {
                    $item = CartItemMapper::toDomain($itemModel);
                    return [
                        'id' => $item->id,
                        'cartId' => $item->cartId,
                        'merchId' => $item->merchId,
                        'quantitat' => $item->quantitat,
                        'isActive' => $item->isActive,
                        'createdAt' => $item->createdAt,
                        'updatedAt' => $item->updatedAt,
                        'merch' => $item->merch,
                    ];
                })
                ->values()
                ->toArray();
        }

        return new Cart(
            id: $model->id,
            usuariId: $model->usuariId,
            isActive: $model->isActive ?? true,
            createdAt: $model->created_at?->toISOString(),
            updatedAt: $model->updated_at?->toISOString(),
            items: $items,
        );
    }

    public static function toArray(Cart $entity): array
    {
        return [
            'id' => $entity->id,
            'usuariId' => $entity->usuariId,
            'isActive' => $entity->isActive,
        ];
    }
}
