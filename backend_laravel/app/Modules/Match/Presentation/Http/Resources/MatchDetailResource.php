<?php
namespace App\Modules\Match\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MatchDetailResource extends JsonResource {
    public function toArray(Request $request)
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
                    'email' => $this->arbitre->email,
                ];
            }),
            'pista' => $this->when($this->pista, function () {
                return [
                    'id' => $this->pista->id,
                    'nom' => $this->pista->nom,
                    'tipus' => $this->pista->tipus,
                ];
            }),
            'setPartits' => $this->when($this->setPartits, $this->setPartits),
            'alineacions' => $this->when($this->alineacions, $this->alineacions),
            'acta' => $this->when($this->acta, function () {
                return [
                    'id' => $this->acta->id,
                    'setsLocal' => $this->acta->setsLocal,
                    'setsVisitant' => $this->acta->setsVisitant,
                    'validada' => $this->acta->validada,
                ];
            }),
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
        ];
    }
}