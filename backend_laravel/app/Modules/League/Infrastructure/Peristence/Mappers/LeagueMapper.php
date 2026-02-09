<?php

namespace App\Modules\League\Infrastructure\Peristence\Mappers;

use App\Modules\League\Domain\Entities\League;
use App\Modules\League\Infrastructure\Peristence\Eloquent\Models\LeagueModel;

class LeagueMapper
{
    public function toDomain(LeagueModel $leagueModel): League
    {
        return new League(
            id: $leagueModel->id,
            nom: $leagueModel->nom,
            categoria: $leagueModel->categoria,
            isActive: $leagueModel->isActive,
            dataInici: $leagueModel->dataInici->toIso8601String(),
            dataFi: $leagueModel->dataFi ? $leagueModel->dataFi->toIso8601String() : null,
            status: $leagueModel->status,
            createdAt: $leagueModel->created_at->toIso8601String(),
            updatedAt: $leagueModel->updated_at->toIso8601String(),
            classificacions: $leagueModel->classificacions->toArray() ?? [],
            jornades: $leagueModel->jornades->toArray() ?? [],
            equips: $leagueModel->equips->toArray() ?? []
        );
    }

    public function toModel(League $league): array
    {
        return [
            'id' => $league->id,
            'nom' => $league->nom,
            'categoria' => $league->categoria,
            'isActive' => $league->isActive,
            'dataInici' => $league->dataInici,
            'dataFi' => $league->dataFi,
            'status' => $league->status,
        ];
    }
}
