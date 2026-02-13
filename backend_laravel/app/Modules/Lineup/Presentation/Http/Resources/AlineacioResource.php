<?php
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
            'jugador' => $this->jugador ? [
                'id' => $this->jugador->id,
                'nom' => $this->jugador->nom,
                'email' => $this->jugador->email,
            ] : null,
            'equip' => $this->equip ? [
                'id' => $this->equip->id,
                'nom' => $this->equip->nom,
                'categoria' => $this->equip->categoria,
            ] : null,
            'partit' => $this->partit ? [
                'id' => $this->partit->id,
                'dataHora' => $this->partit->dataHora,
                'status' => $this->partit->status,
            ] : null,
        ];
    }
}
