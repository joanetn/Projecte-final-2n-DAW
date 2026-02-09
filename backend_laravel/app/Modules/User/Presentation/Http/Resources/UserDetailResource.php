<?php

namespace App\Modules\User\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'email' => $this->email,
            'telefon' => $this->telefon,
            'dataNaixement' => $this->dataNaixement,
            'nivell' => $this->nivell,
            'avatar' => $this->avatar,
            'dni' => $this->dni,
            'isActive' => $this->isActive,
            'rols' => $this->rols ?? [],
            'equipUsuaris' => $this->equipUsuaris ?? [],
            'compras' => $this->compras ?? [],
            'seguros' => $this->seguros ?? [],
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
        ];
    }
}
