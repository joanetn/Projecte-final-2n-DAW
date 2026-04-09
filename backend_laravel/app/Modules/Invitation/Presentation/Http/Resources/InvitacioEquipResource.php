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
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
            'equip' => $this->equip ? [
                'id' => $this->equip->id ?? ($this->equip['id'] ?? null),
                'nom' => $this->equip->nom ?? ($this->equip['nom'] ?? null),
                'categoria' => $this->equip->categoria ?? ($this->equip['categoria'] ?? null),
                'clubId' => $this->equip->clubId ?? ($this->equip['clubId'] ?? null),
                'lligaId' => $this->equip->lligaId ?? ($this->equip['lligaId'] ?? null),
                'isActive' => $this->equip->isActive ?? ($this->equip['isActive'] ?? null),
                'createdAt' => $this->equip->createdAt ?? $this->equip['createdAt'] ?? $this->equip['created_at'] ?? null,
                'updatedAt' => $this->equip->updatedAt ?? $this->equip['updatedAt'] ?? $this->equip['updated_at'] ?? null,
            ] : null,
            'usuari' => $this->usuari ? [
                'id' => $this->usuari->id ?? ($this->usuari['id'] ?? null),
                'nom' => $this->usuari->nom ?? ($this->usuari['nom'] ?? null),
                'email' => $this->usuari->email ?? ($this->usuari['email'] ?? null),
                'telefon' => $this->usuari->telefon ?? ($this->usuari['telefon'] ?? null),
                'dataNaixement' => $this->usuari->dataNaixement ?? ($this->usuari['dataNaixement'] ?? null),
                'avatar' => $this->usuari->avatar ?? ($this->usuari['avatar'] ?? null),
                'dni' => $this->usuari->dni ?? ($this->usuari['dni'] ?? null),
                'nivell' => $this->usuari->nivell ?? ($this->usuari['nivell'] ?? null),
                'isActive' => $this->usuari->isActive ?? ($this->usuari['isActive'] ?? null),
            ] : null,
        ];
    }
}
