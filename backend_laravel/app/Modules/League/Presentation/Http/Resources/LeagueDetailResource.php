<?php

namespace App\Modules\League\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LeagueDetailResource extends JsonResource
{
    public function toArray(Request $request): array
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
                    'lligaId' => $jornada['lligaId'] ?? $jornada->lligaId,
                    'status' => $jornada['status'] ?? $jornada->status,
                    'isActive' => $jornada['isActive'] ?? $jornada->isActive,
                    'createdAt' => $jornada['created_at'] ?? $jornada->created_at ?? $jornada->createdAt,
                    'updatedAt' => $jornada['updated_at'] ?? $jornada->updated_at ?? $jornada->updatedAt,
                ];
            })->toArray(),
            'equips' => collect($this->equips ?? [])->map(function ($equip) {
                return [
                    'id' => $equip['id'] ?? $equip->id,
                    'nom' => $equip['nom'] ?? $equip->nom,
                    'categoria' => $equip['categoria'] ?? $equip->categoria,
                    'clubId' => $equip['clubId'] ?? $equip->clubId,
                    'lligaId' => $equip['lligaId'] ?? $equip->lligaId,
                    'isActive' => $equip['isActive'] ?? $equip->isActive,
                    'createdAt' => $equip['created_at'] ?? $equip->created_at ?? $equip->createdAt,
                    'updatedAt' => $equip['updated_at'] ?? $equip->updated_at ?? $equip->updatedAt,
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
