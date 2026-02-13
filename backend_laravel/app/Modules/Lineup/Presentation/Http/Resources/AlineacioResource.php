<?php

/**
 * Resource d'Alineació per a la resposta JSON.
 *
 * Transforma l'entitat de domini al format JSON de resposta.
 * Inclou les relacions carregades (jugador, equip, partit) si estan disponibles.
 * Segueix el patró de Laravel API Resources.
 */

namespace App\Modules\Lineup\Presentation\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AlineacioResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'partitId' => $this->partitId,
            'jugadorId' => $this->jugadorId,
            'equipId' => $this->equipId,
            'posicio' => $this->posicio,
            'isActive' => $this->isActive,
            'creadaAt' => $this->creadaAt,
            // Relació jugador: només es mostra si està carregada
            'jugador' => $this->jugador ? [
                'id' => $this->jugador->id,
                'nom' => $this->jugador->nom,
                'email' => $this->jugador->email,
            ] : null,
            // Relació equip: només es mostra si està carregada
            'equip' => $this->equip ? [
                'id' => $this->equip->id,
                'nom' => $this->equip->nom,
                'categoria' => $this->equip->categoria,
            ] : null,
            // Relació partit: només es mostra si està carregada
            'partit' => $this->partit ? [
                'id' => $this->partit->id,
                'dataHora' => $this->partit->dataHora,
                'status' => $this->partit->status,
            ] : null,
        ];
    }
}
