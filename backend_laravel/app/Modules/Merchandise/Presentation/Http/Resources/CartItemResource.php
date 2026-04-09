<?php

namespace App\Modules\Merchandise\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $item = is_array($this->resource) ? $this->resource : (array) $this->resource;

        $quantitat = (int) ($item['quantitat'] ?? 0);
        $preu = (float) data_get($item, 'merch.preu', 0);

        return [
            'id' => $item['id'] ?? null,
            'cartId' => $item['cartId'] ?? null,
            'merchId' => $item['merchId'] ?? null,
            'quantitat' => $quantitat,
            'isActive' => (bool) ($item['isActive'] ?? true),
            'createdAt' => $item['createdAt'] ?? null,
            'updatedAt' => $item['updatedAt'] ?? null,
            'merch' => $item['merch'] ? [
                'id' => $item['merch']['id'] ?? ($item['merch']->id ?? null),
                'nom' => $item['merch']['nom'] ?? ($item['merch']->nom ?? null),
                'marca' => $item['merch']['marca'] ?? ($item['merch']->marca ?? null),
                'imageUrl' => $item['merch']['imageUrl'] ?? ($item['merch']->imageUrl ?? null),
                'preu' => $item['merch']['preu'] ?? ($item['merch']->preu ?? null),
                'stock' => $item['merch']['stock'] ?? ($item['merch']->stock ?? null),
                'isActive' => $item['merch']['isActive'] ?? ($item['merch']->isActive ?? null),
            ] : null,
            'subtotal' => round($preu * $quantitat, 2),
        ];
    }
}
