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
            ] : null,
            'equip' => $this->equip ? [
                'id' => $this->equip['id'] ?? $this->equip->id,
                'nom' => $this->equip['nom'] ?? $this->equip->nom,
                'categoria' => $this->equip['categoria'] ?? $this->equip->categoria,
            ] : null,
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
        ];
    }
}
