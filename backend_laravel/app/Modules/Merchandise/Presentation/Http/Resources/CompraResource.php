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
            'updatedAt' => $this->updatedAt,
            'usuari' => $this->usuari ? [
                'id' => $this->usuari->id ?? $this->usuari['id'],
                'nom' => $this->usuari->nom ?? $this->usuari['nom'],
                'email' => $this->usuari->email ?? $this->usuari['email'],
                'telefon' => $this->usuari->telefon ?? $this->usuari['telefon'],
                'dataNaixement' => $this->usuari->dataNaixement ?? $this->usuari['dataNaixement'],
                'avatar' => $this->usuari->avatar ?? $this->usuari['avatar'],
                'dni' => $this->usuari->dni ?? $this->usuari['dni'],
                'nivell' => $this->usuari->nivell ?? $this->usuari['nivell'],
                'isActive' => $this->usuari->isActive ?? $this->usuari['isActive'],
            ] : null,
            'merch' => $this->merch ? [
                'id' => $this->merch->id ?? $this->merch['id'],
                'nom' => $this->merch->nom ?? $this->merch['nom'],
                'marca' => $this->merch->marca ?? $this->merch['marca'],
                'imageUrl' => $this->merch->imageUrl ?? $this->merch['imageUrl'],
                'preu' => $this->merch->preu ?? $this->merch['preu'],
                'stock' => $this->merch->stock ?? $this->merch['stock'],
                'isActive' => $this->merch->isActive ?? $this->merch['isActive'],
            ] : null,
        ];
    }
}
