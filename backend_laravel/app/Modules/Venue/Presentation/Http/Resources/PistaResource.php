<?php

/**
 * Resource per a transformar una Pista a JSON per la resposta API.
 *
 * Formata les dades de la pista per retornar al client.
 * Inclou l'instalacioId per identificar a quina instal·lació pertany.
 */

namespace App\Modules\Venue\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PistaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'tipus' => $this->tipus,
            'instalacioId' => $this->instalacioId,
            'isActive' => $this->isActive,
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
        ];
    }
}
