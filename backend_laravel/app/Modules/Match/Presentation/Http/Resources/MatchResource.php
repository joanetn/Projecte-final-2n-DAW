<?php

namespace App\Modules\Match\Presentation\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MatchResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'jornadaId' => $this->jornadaId,
            'localId' => $this->localId,
            'visitantId' => $this->visitantId,
            'dataHora' => $this->dataHora,
            'pistaId' => $this->pistaId,
            'arbitreId' => $this->arbitreId,
            'status' => $this->status,
            'isActive' => $this->isActive,
            'local' => $this->local ? [
                'id' => $this->local->id,
                'nom' => $this->local->nom,
                'categoria' => $this->local->categoria,
            ] : null,
            'visitant' => $this->visitant ? [
                'id' => $this->visitant->id,
                'nom' => $this->visitant->nom,
                'categoria' => $this->visitant->categoria,
            ] : null,
            'jornada' => $this->jornada ? [
                'id' => $this->jornada->id,
                'nom' => $this->jornada->nom,
                'data' => $this->jornada->data,
            ] : null,
            'arbitre' => $this->arbitre ? [
                'id' => $this->arbitre->id,
                'nom' => $this->arbitre->nom,
            ] : null,
            'pista' => $this->pista ? [
                'id' => $this->pista->id,
                'nom' => $this->pista->nom,
            ] : null,
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
        ];
    }
}
