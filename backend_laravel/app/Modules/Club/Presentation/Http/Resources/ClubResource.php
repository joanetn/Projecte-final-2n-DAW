<?php

namespace App\Modules\Club\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Resource per a transformar un Club a JSON per la resposta API.
 * JsonResource fa que les entitats de domini es converteixen automàticament
 * al format JSON que necessitem, accedint a les propietats amb $this->.
 */
class ClubResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'descripcio' => $this->descripcio,
            'adreca' => $this->adreca,
            'ciutat' => $this->ciutat,
            'codiPostal' => $this->codiPostal,
            'provincia' => $this->provincia,
            'telefon' => $this->telefon,
            'email' => $this->email,
            'web' => $this->web,
            'anyFundacio' => $this->anyFundacio,
            'creadorId' => $this->creadorId,
            'isActive' => $this->isActive,
            // Incloem els equips del club si estan carregats
            'equips' => collect($this->equips ?? [])->map(function ($equip) {
                return [
                    'id' => $equip['id'] ?? $equip->id,
                    'nom' => $equip['nom'] ?? $equip->nom,
                    'categoria' => $equip['categoria'] ?? $equip->categoria,
                    'isActive' => $equip['isActive'] ?? $equip->isActive,
                ];
            })->toArray(),
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
        ];
    }
}
