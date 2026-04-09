<?php

namespace App\Modules\League\Presentation\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class LeagueResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'categoria' => $this->categoria,
            'dataInici' => $this->dataInici,
            'dataFi' => $this->dataFi,
            'status' => $this->status,
            'isActive' => $this->isActive,
            'logo_url' => $this->logo_url,
            'jornades' => collect($this->jornades ?? [])->map(function ($jornada) {
                return [
                    'id' => $jornada['id'] ?? $jornada->id,
                    'nom' => $jornada['nom'] ?? $jornada->nom,
                    'dataInici' => $jornada['dataInici'] ?? $jornada->dataInici,
                    'dataFi' => $jornada['dataFi'] ?? $jornada->dataFi,
                    'status' => $jornada['status'] ?? $jornada->status,
                ];
            })->toArray(),
            'equips' => collect($this->equips ?? [])->map(function ($equip) {
                return [
                    'id' => $equip['id'] ?? $equip->id,
                    'nom' => $equip['nom'] ?? $equip->nom,
                    'categoria' => $equip['categoria'] ?? $equip->categoria,
                ];
            })->toArray(),
            'classificacions' => collect($this->classificacions ?? [])->map(function ($classificacio) {
                return [
                    'id' => $classificacio['id'] ?? $classificacio->id,
                    'lligaId' => $classificacio['lligaId'] ?? $classificacio->lligaId,
                    'equipId' => $classificacio['equipId'] ?? $classificacio->equipId,
                    'partitsJugats' => $classificacio['partitsJugats'] ?? $classificacio->partitsJugats,
                    'partitsGuanyats' => $classificacio['partitsGuanyats'] ?? $classificacio->partitsGuanyats,
                    'partitsPerduts' => $classificacio['partitsPerduts'] ?? $classificacio->partitsPerduts,
                    'partitsEmpatats' => $classificacio['partitsEmpatats'] ?? $classificacio->partitsEmpatats,
                    'setsGuanyats' => $classificacio['setsGuanyats'] ?? $classificacio->setsGuanyats,
                    'setsPerduts' => $classificacio['setsPerduts'] ?? $classificacio->setsPerduts,
                    'jocsGuanyats' => $classificacio['jocsGuanyats'] ?? $classificacio->jocsGuanyats,
                    'jocsPerduts' => $classificacio['jocsPerduts'] ?? $classificacio->jocsPerduts,
                    'punts' => $classificacio['punts'] ?? $classificacio->punts,
                    'isActive' => $classificacio['isActive'] ?? $classificacio->isActive,
                    'createdAt' => $classificacio['created_at'] ?? $classificacio->created_at ?? $classificacio->createdAt,
                    'updatedAt' => $classificacio['updated_at'] ?? $classificacio->updated_at ?? $classificacio->updatedAt,
                ];
            })->toArray(),
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
        ];
    }
}
