<?php

namespace App\Modules\AdminWeb\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LeagueTeamResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => is_array($this->resource) ? ($this->resource['id'] ?? null) : $this->id,
            'nom' => is_array($this->resource) ? ($this->resource['nom'] ?? null) : $this->nom,
            'categoria' => is_array($this->resource) ? ($this->resource['categoria'] ?? null) : $this->categoria,
            'isActive' => is_array($this->resource) ? ($this->resource['isActive'] ?? false) : (bool) $this->isActive,
        ];
    }
}
