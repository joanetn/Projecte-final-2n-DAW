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
                'clubId' => $this->local->clubId,
                'lligaId' => $this->local->lligaId,
                'isActive' => $this->local->isActive,
                'createdAt' => $this->local->created_at ?? $this->local->createdAt,
                'updatedAt' => $this->local->updated_at ?? $this->local->updatedAt,
            ] : null,
            'visitant' => $this->visitant ? [
                'id' => $this->visitant->id,
                'nom' => $this->visitant->nom,
                'categoria' => $this->visitant->categoria,
                'clubId' => $this->visitant->clubId,
                'lligaId' => $this->visitant->lligaId,
                'isActive' => $this->visitant->isActive,
                'createdAt' => $this->visitant->created_at ?? $this->visitant->createdAt,
                'updatedAt' => $this->visitant->updated_at ?? $this->visitant->updatedAt,
            ] : null,
            'jornada' => $this->jornada ? [
                'id' => $this->jornada->id,
                'nom' => $this->jornada->nom,
                'dataInici' => $this->jornada->dataInici,
                'dataFi' => $this->jornada->dataFi,
                'lligaId' => $this->jornada->lligaId,
                'status' => $this->jornada->status,
                'isActive' => $this->jornada->isActive,
                'createdAt' => $this->jornada->created_at ?? $this->jornada->createdAt,
                'updatedAt' => $this->jornada->updated_at ?? $this->jornada->updatedAt,
            ] : null,
            'arbitre' => $this->arbitre ? [
                'id' => $this->arbitre->id,
                'nom' => $this->arbitre->nom,
                'email' => $this->arbitre->email,
                'telefon' => $this->arbitre->telefon,
                'isActive' => $this->arbitre->isActive,
                'createdAt' => $this->arbitre->created_at ?? $this->arbitre->createdAt,
                'updatedAt' => $this->arbitre->updated_at ?? $this->arbitre->updatedAt,
            ] : null,
            'pista' => $this->pista ? [
                'id' => $this->pista->id,
                'nom' => $this->pista->nom,
                'instalacioId' => $this->pista->instalacioId,
                'numero' => $this->pista->numero,
                'tipo' => $this->pista->tipo,
                'isActive' => $this->pista->isActive,
                'createdAt' => $this->pista->created_at ?? $this->pista->createdAt,
                'updatedAt' => $this->pista->updated_at ?? $this->pista->updatedAt,
            ] : null,
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
        ];
    }
}
