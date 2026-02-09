<?php

namespace App\Modules\League\Infrastructure\Peristence\Mappers;

use App\Modules\League\Domain\Entities\Round;
use App\Modules\League\Infrastructure\Peristence\Eloquent\Models\RoundModel;

class RoundMapper
{
    public function toDomain(RoundModel $roundModel): Round
    {
        return new Round(
            id: $roundModel->id,
            nom: $roundModel->nom,
            lligaId: $roundModel->lligaId,
            dataInici: $roundModel->dataInici->toIso8601String(),
            dataFi: $roundModel->dataFi ? $roundModel->dataFi->toIso8601String() : null,
            status: $roundModel->status,
            createdAt: $roundModel->created_at->toIso8601String(),
            updatedAt: $roundModel->updated_at->toIso8601String(),
            partits: $roundModel->relationLoaded('partits') ? $roundModel->partits->toArray() : null
        );
    }

    public function toModel(Round $round): array
    {
        return [
            'id' => $round->id,
            'nom' => $round->nom,
            'lligaId' => $round->lligaId,
            'dataInici' => $round->dataInici,
            'dataFi' => $round->dataFi,
            'status' => $round->status,
        ];
    }
}
