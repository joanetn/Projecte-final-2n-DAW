<?php

namespace App\Modules\Venue\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InstalacioResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'adreca' => $this->adreca,
            'telefon' => $this->telefon,
            'tipusPista' => $this->tipusPista,
            'numPistes' => $this->numPistes,
            'clubId' => $this->clubId,
            'isActive' => $this->isActive,
            'pistes' => collect($this->pistes ?? [])->map(function ($pista) {
                return [
                    'id' => $pista['id'] ?? $pista->id,
                    'nom' => $pista['nom'] ?? $pista->nom,
                    'tipus' => $pista['tipus'] ?? $pista->tipus,
                    'instalacioId' => $pista['instalacioId'] ?? $pista->instalacioId,
                    'numero' => $pista['numero'] ?? $pista->numero,
                    'isActive' => $pista['isActive'] ?? $pista->isActive,
                    'createdAt' => $pista['createdAt'] ?? $pista->createdAt ?? $pista['created_at'] ?? null,
                    'updatedAt' => $pista['updatedAt'] ?? $pista->updatedAt ?? $pista['updated_at'] ?? null,
                ];
            })->toArray(),
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
        ];
    }
}
