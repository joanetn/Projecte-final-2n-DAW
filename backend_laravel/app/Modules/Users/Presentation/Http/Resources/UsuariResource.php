<?php

namespace App\Modules\Users\Presentation\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UsuariResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'email' => $this->email,
            'telefon' => $this->telefon,
            'dataNaixement' => $this->dataNaixement?->format('Y-m-d'),
            'nivell' => $this->nivell,
            'avatar' => $this->avatar,
            'dni' => $this->dni,
            'isActive' => $this->isActive,
            'rols' => $this->rols ?? [],
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
