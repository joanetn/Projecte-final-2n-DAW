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
            'merch' => $item['merch'] ?? null,
            'subtotal' => round($preu * $quantitat, 2),
        ];
    }
}
