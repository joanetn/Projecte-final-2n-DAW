<?php

namespace App\Modules\League\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StandingDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'lligaId' => $this->lligaId,
            'equipId' => $this->equipId,
            'partitsJugats' => $this->partitsJugats,
            'partitsGuanyats' => $this->partitsGuanyats,
            'partitsPerduts' => $this->partitsPerduts,
            'partitsEmpatats' => $this->partitsEmpatats,
            'setsGuanyats' => $this->setsGuanyats,
            'setsPerduts' => $this->setsPerduts,
            'jocsGuanyats' => $this->jocsGuanyats,
            'jocsPerduts' => $this->jocsPerduts,
            'punts' => $this->punts,
            'isActive' => $this->isActive,
            'lliga' => $this->lliga ? [
                'id' => $this->lliga['id'] ?? $this->lliga->id,
                'nom' => $this->lliga['nom'] ?? $this->lliga->nom,
                'categoria' => $this->lliga['categoria'] ?? $this->lliga->categoria,
                'createdAt' => $this->lliga['createdAt'] ?? $this->lliga->createdAt ?? $this->lliga['created_at'] ?? null,
                'updatedAt' => $this->lliga['updatedAt'] ?? $this->lliga->updatedAt ?? $this->lliga['updated_at'] ?? null,
            ] : null,
            'equip' => $this->equip ? [
                'id' => $this->equip['id'] ?? $this->equip->id,
                'nom' => $this->equip['nom'] ?? $this->equip->nom,
                'categoria' => $this->equip['categoria'] ?? $this->equip->categoria,
                'clubId' => $this->equip['clubId'] ?? $this->equip->clubId,
                'lligaId' => $this->equip['lligaId'] ?? $this->equip->lligaId,
                'isActive' => $this->equip['isActive'] ?? $this->equip->isActive,
                'createdAt' => $this->equip['createdAt'] ?? $this->equip->createdAt ?? $this->equip['created_at'] ?? null,
                'updatedAt' => $this->equip['updatedAt'] ?? $this->equip->updatedAt ?? $this->equip['updated_at'] ?? null,
            ] : null,
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
        ];
    }
}
