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
            dataInici: $leagueModel->dataInici->toIso8601String(),
            dataFi: $leagueModel->dataFi ? $leagueModel->dataFi->toIso8601String() : null,
            status: $leagueModel->status,
            isActive: $leagueModel->isActive,
            logo_url: $leagueModel->logo_url,
            createdAt: $leagueModel->created_at->toIso8601String(),
            updatedAt: $leagueModel->updated_at->toIso8601String(),
            jornades: $leagueModel->jornades->toArray() ?? [],
            equips: $leagueModel->equips->toArray() ?? [],
            classificacions: $leagueModel->classificacions->toArray() ?? []
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
            'logo_url' => $league->logo_url,
        ];
    }
}
