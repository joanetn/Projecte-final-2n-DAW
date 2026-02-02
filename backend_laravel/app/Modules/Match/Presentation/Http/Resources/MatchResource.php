<?php
namespace App\Modules\Match\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MatchResource extends JsonResource {
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
            'local' => $this->when($this->local, function () {
                return [
                    'id' => $this->local->id,
                    'nom' => $this->local->nom,
                    'categoria' => $this->local->categoria,
                ];
            }),
            'visitant' => $this->when($this->visitant, function () {
                return [
                    'id' => $this->visitant->id,
                    'nom' => $this->visitant->nom,
                    'categoria' => $this->visitant->categoria,
                ];
            }),
            'jornada' => $this->when($this->jornada, function () {
                return [
                    'id' => $this->jornada->id,
                    'nom' => $this->jornada->nom,
                    'data' => $this->jornada->data,
                ];
            }),
            'arbitre' => $this->when($this->arbitre, function () {
                return [
                    'id' => $this->arbitre->id,
                    'nom' => $this->arbitre->nom,
                ];
            }),
            'pista' => $this->when($this->pista, function () {
                return [
                    'id' => $this->pista->id,
                    'nom' => $this->pista->nom,
                ];
            }),
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
        ];
    }
}