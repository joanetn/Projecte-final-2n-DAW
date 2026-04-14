<?php

namespace App\Modules\Merchandise\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompraResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'usuariId' => $this->usuariId,
            'merchId' => $this->merchId,
            'quantitat' => $this->quantitat,
            'total' => $this->total,
            'pagat' => $this->pagat,
            'status' => $this->status,
            'isActive' => $this->isActive,
            'createdAt' => $this->createdAt,
            'usuari' => $this->usuari ? [
                'id' => $this->usuari['id'] ?? null,
                'nom' => $this->usuari['nom'] ?? null,
                'email' => $this->usuari['email'] ?? null,
                'dataNaixement' => $this->usuari['dataNaixement'] ?? null,
                'avatar' => $this->usuari['avatar'] ?? null,
                'dni' => $this->usuari['dni'] ?? null,
                'nivell' => $this->usuari['nivell'] ?? null,
                'isActive' => $this->usuari['isActive'] ?? null,
            ] : null,
            'merch' => $this->merch ? [
                'id' => $this->merch['id'] ?? null,
                'nom' => $this->merch['nom'] ?? null,
                'marca' => $this->merch['marca'] ?? null,
                'imageUrl' => $this->merch['imageUrl'] ?? null,
                'preu' => $this->merch['preu'] ?? null,
                'stock' => $this->merch['stock'] ?? null,
                'isActive' => $this->merch['isActive'] ?? null,
            ] : null,
        ];
    }
}
