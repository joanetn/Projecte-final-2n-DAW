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
            'jugador' => $this->jugador ? [
                'id' => $this->jugador->id,
                'nom' => $this->jugador->nom,
                'email' => $this->jugador->email,
            ] : null,
            'partit' => $this->partit ? [
                'id' => $this->partit->id,
                'dataHora' => $this->partit->dataHora,
                'status' => $this->partit->status,
            ] : null,
        ];
    }
}
