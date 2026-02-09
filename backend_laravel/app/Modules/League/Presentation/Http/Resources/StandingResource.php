<?php

namespace App\Modules\League\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StandingResource extends JsonResource
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
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
        ];
    }
}
