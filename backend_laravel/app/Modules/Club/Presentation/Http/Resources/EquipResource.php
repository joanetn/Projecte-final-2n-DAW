<?php

namespace App\Modules\Club\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Resource per a transformar un Equip a JSON per la resposta API.
 * Inclou la informació del club i els membres si estan carregats.
 */
class EquipResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'categoria' => $this->categoria,
            'clubId' => $this->clubId,
            'lligaId' => $this->lligaId,
            'isActive' => $this->isActive,
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
        ];
    }
}
