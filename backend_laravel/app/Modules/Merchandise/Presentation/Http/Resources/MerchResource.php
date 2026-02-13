<?php

namespace App\Modules\Merchandise\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MerchResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'marca' => $this->marca,
            'preu' => $this->preu,
            'stock' => $this->stock,
            'isActive' => $this->isActive,
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
            'compras' => $this->compras,
        ];
    }
}
