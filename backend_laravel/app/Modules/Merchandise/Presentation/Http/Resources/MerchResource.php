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
            'imageUrl' => $this->imageUrl,
            'preu' => $this->preu,
            'stock' => $this->stock,
            'isActive' => $this->isActive,
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
            'compras' => collect($this->compras ?? [])->map(function ($compra) {
                return [
                    'id' => $compra['id'] ?? $compra->id,
                    'usuariId' => $compra['usuariId'] ?? $compra->usuariId,
                    'merchId' => $compra['merchId'] ?? $compra->merchId,
                    'quantitat' => $compra['quantitat'] ?? $compra->quantitat,
                    'total' => $compra['total'] ?? $compra->total,
                    'pagat' => $compra['pagat'] ?? $compra->pagat,
                    'status' => $compra['status'] ?? $compra->status,
                    'isActive' => $compra['isActive'] ?? $compra->isActive,
                    'createdAt' => $compra['createdAt'] ?? $compra->createdAt ?? $compra['created_at'] ?? null,
                    'updatedAt' => $compra['updatedAt'] ?? $compra->updatedAt ?? $compra['updated_at'] ?? null,
                ];
            })->toArray(),
        ];
    }
}
