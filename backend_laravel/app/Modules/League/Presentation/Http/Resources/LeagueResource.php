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
                    'equipId' => $classificacio['equipId'] ?? $classificacio->equipId,
                    'partitsJugats' => $classificacio['partitsJugats'] ?? $classificacio->partitsJugats,
                    'partitsGuanyats' => $classificacio['partitsGuanyats'] ?? $classificacio->partitsGuanyats,
                    'setsGuanyats' => $classificacio['setsGuanyats'] ?? $classificacio->setsGuanyats,
                    'setPerduts' => $classificacio['setPerduts'] ?? $classificacio->setPerduts,
                    'punts' => $classificacio['punts'] ?? $classificacio->punts,
                ];
            })->toArray(),
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
        ];
    }
}
