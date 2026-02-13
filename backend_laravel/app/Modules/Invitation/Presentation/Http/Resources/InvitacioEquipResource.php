<?php

namespace App\Modules\Invitation\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvitacioEquipResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'equipId' => $this->equipId,
            'usuariId' => $this->usuariId,
            'missatge' => $this->missatge,
            'estat' => $this->estat,
            'isActive' => $this->isActive,
            'equip' => $this->equip ? [
                'id' => $this->equip->id ?? ($this->equip['id'] ?? null),
                'nom' => $this->equip->nom ?? ($this->equip['nom'] ?? null),
            ] : null,
            'usuari' => $this->usuari ? [
                'id' => $this->usuari->id ?? ($this->usuari['id'] ?? null),
                'nom' => $this->usuari->nom ?? ($this->usuari['nom'] ?? null),
                'email' => $this->usuari->email ?? ($this->usuari['email'] ?? null),
            ] : null,
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
        ];
    }
}
