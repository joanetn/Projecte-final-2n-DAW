<?php

namespace App\Modules\AdminWeb\Application\DTOs;

class GenerateLeagueFixturesDTO
{
    public function __construct(
        public readonly string $leagueId,
        public readonly bool $force = false,
    ) {}
}
