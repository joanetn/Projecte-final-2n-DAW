<?php

namespace App\Modules\Club\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Resource per a transformar un EquipUsuari (membre d'equip) a JSON.
 * Mostra l'ID del membre, l'equip, l'usuari i el seu rol dins l'equip.
 */
class EquipUsuariResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'equipId' => $this->equipId,
            'usuariId' => $this->usuariId,
            'rolEquip' => $this->rolEquip,
            'isActive' => $this->isActive,
            'createdAt' => $this->createdAt,
        ];
    }
}
