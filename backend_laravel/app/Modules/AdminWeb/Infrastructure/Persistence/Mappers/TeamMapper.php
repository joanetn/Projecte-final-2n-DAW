<?php

namespace App\Modules\AdminWeb\Infrastructure\Persistence\Mappers;

use App\Modules\AdminWeb\Infrastructure\Persistence\Eloquent\Models\TeamModel;

class TeamMapper
{
    /** @return array{id:string,nom:string,categoria:?string,isActive:bool} */
    public static function toSummaryArray(TeamModel $team): array
    {
        return [
            'id' => (string) $team->id,
            'nom' => (string) $team->nom,
            'categoria' => $team->categoria,
            'isActive' => (bool) $team->isActive,
        ];
    }
}
