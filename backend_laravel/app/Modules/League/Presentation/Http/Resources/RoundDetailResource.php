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
                'createdAt' => $this->lliga['createdAt'] ?? $this->lliga->createdAt ?? $this->lliga['created_at'] ?? null,
                'updatedAt' => $this->lliga['updatedAt'] ?? $this->lliga->updatedAt ?? $this->lliga['updated_at'] ?? null,
            ] : null,
            'partits' => collect($this->partits ?? [])->map(function ($partit) {
                return [
                    'id' => $partit['id'] ?? $partit->id,
                    'dataHora' => $partit['dataHora'] ?? $partit->dataHora,
                    'status' => $partit['status'] ?? $partit->status,
                    'jornadaId' => $partit['jornadaId'] ?? $partit->jornadaId,
                    'arbitreId' => $partit['arbitreId'] ?? $partit->arbitreId ?? null,
                    'pistaId' => $partit['pistaId'] ?? $partit->pistaId ?? null,
                    'localEquipId' => $partit['localEquipId'] ?? $partit->localEquipId,
                    'visitantEquipId' => $partit['visitantEquipId'] ?? $partit->visitantEquipId,
                    'golesLocal' => $partit['golesLocal'] ?? $partit->golesLocal,
                    'golesVisitant' => $partit['golesVisitant'] ?? $partit->golesVisitant,
                    'isActive' => $partit['isActive'] ?? $partit->isActive,
                    'equipLocal' => $partit['equipLocal'] ?? $partit->equipLocal,
                    'equipVisitant' => $partit['equipVisitant'] ?? $partit->equipVisitant,
                    'createdAt' => $partit['createdAt'] ?? $partit->createdAt ?? $partit['created_at'] ?? null,
                    'updatedAt' => $partit['updatedAt'] ?? $partit->updatedAt ?? $partit['updated_at'] ?? null,
                ];
            })->toArray(),
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
        ];
    }
}
