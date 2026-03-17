<?php

namespace App\Modules\Merchandise\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $itemsCollection = collect($this->items ?? []);
        $items = CartItemResource::collection($itemsCollection);

        $totalItems = (int) $itemsCollection->sum(function (array $item): int {
            return (int) ($item['quantitat'] ?? 0);
        });

        $totalAmount = round($itemsCollection->sum(function (array $item): float {
            $qty = (int) ($item['quantitat'] ?? 0);
            $price = (float) data_get($item, 'merch.preu', 0);
            return $qty * $price;
        }), 2);

        return [
            'id' => $this->id,
            'usuariId' => $this->usuariId,
            'isActive' => (bool) $this->isActive,
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
            'totalItems' => $totalItems,
            'totalAmount' => $totalAmount,
            'items' => $items,
        ];
    }
}
