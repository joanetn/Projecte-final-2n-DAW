<?php

namespace App\Modules\League\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoundResource extends JsonResource
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
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
        ];
    }
}
