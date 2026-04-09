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
            'clubId' => is_array($this->resource) ? ($this->resource['clubId'] ?? null) : $this->clubId,
            'lligaId' => is_array($this->resource) ? ($this->resource['lligaId'] ?? null) : $this->lligaId,
            'isActive' => is_array($this->resource) ? ($this->resource['isActive'] ?? false) : (bool) $this->isActive,
            'createdAt' => is_array($this->resource) ? ($this->resource['created_at'] ?? $this->resource['createdAt'] ?? null) : (method_exists($this, 'created_at') ? $this->created_at : $this->createdAt),
            'updatedAt' => is_array($this->resource) ? ($this->resource['updated_at'] ?? $this->resource['updatedAt'] ?? null) : (method_exists($this, 'updated_at') ? $this->updated_at : $this->updatedAt),
        ];
    }
}
