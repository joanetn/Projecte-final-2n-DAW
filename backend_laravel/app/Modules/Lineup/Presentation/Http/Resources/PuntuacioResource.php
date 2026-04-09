<?php

namespace App\Modules\Lineup\Presentation\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PuntuacioResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'partitId' => $this->partitId,
            'jugadorId' => $this->jugadorId,
            'punts' => $this->punts,
            'isActive' => $this->isActive,
            'createdAt' => $this->createdAt ?? null,
            'updatedAt' => $this->updatedAt ?? null,
            'jugador' => $this->jugador ? [
                'id' => $this->jugador->id ?? $this->jugador['id'],
                'nom' => $this->jugador->nom ?? $this->jugador['nom'],
                'email' => $this->jugador->email ?? $this->jugador['email'],
                'telefon' => $this->jugador->telefon ?? $this->jugador['telefon'],
                'dataNaixement' => $this->jugador->dataNaixement ?? $this->jugador['dataNaixement'],
                'avatar' => $this->jugador->avatar ?? $this->jugador['avatar'],
                'dni' => $this->jugador->dni ?? $this->jugador['dni'],
                'nivell' => $this->jugador->nivell ?? $this->jugador['nivell'],
                'isActive' => $this->jugador->isActive ?? $this->jugador['isActive'],
            ] : null,
            'partit' => $this->partit ? [
                'id' => $this->partit->id ?? $this->partit['id'],
                'dataHora' => $this->partit->dataHora ?? $this->partit['dataHora'],
                'status' => $this->partit->status ?? $this->partit['status'],
                'jornadaId' => $this->partit->jornadaId ?? $this->partit['jornadaId'],
                'arbitreId' => $this->partit->arbitreId ?? $this->partit['arbitreId'] ?? null,
                'pistaId' => $this->partit->pistaId ?? $this->partit['pistaId'] ?? null,
                'localEquipId' => $this->partit->localEquipId ?? $this->partit['localEquipId'],
                'visitantEquipId' => $this->partit->visitantEquipId ?? $this->partit['visitantEquipId'],
                'golesLocal' => $this->partit->golesLocal ?? $this->partit['golesLocal'],
                'golesVisitant' => $this->partit->golesVisitant ?? $this->partit['golesVisitant'],
                'isActive' => $this->partit->isActive ?? $this->partit['isActive'],
                'createdAt' => $this->partit->createdAt ?? $this->partit['createdAt'] ?? $this->partit['created_at'] ?? null,
                'updatedAt' => $this->partit->updatedAt ?? $this->partit['updatedAt'] ?? $this->partit['updated_at'] ?? null,
            ] : null,
        ];
    }
}
