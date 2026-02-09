<?php

namespace App\Modules\League\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoundDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'dataInici' => $this->dataInici,
            'dataFi' => $this->dataFi,
            'lligaId' => $this->lligaId,
            'status' => $this->status,
            'isActive' => $this->isActive,
            'lliga' => $this->lliga ? [
                'id' => $this->lliga['id'] ?? $this->lliga->id,
                'nom' => $this->lliga['nom'] ?? $this->lliga->nom,
                'categoria' => $this->lliga['categoria'] ?? $this->lliga->categoria,
            ] : null,
            'partits' => collect($this->partits ?? [])->map(function ($partit) {
                return [
                    'id' => $partit['id'] ?? $partit->id,
                    'equipLocal' => $partit['equipLocal'] ?? $partit->equipLocal,
                    'equipVisitant' => $partit['equipVisitant'] ?? $partit->equipVisitant,
                    'dataHora' => $partit['dataHora'] ?? $partit->dataHora,
                    'status' => $partit['status'] ?? $partit->status,
                ];
            })->toArray(),
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
        ];
    }
}
