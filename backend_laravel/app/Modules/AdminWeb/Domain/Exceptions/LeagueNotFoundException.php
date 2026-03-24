<?php

namespace App\Modules\AdminWeb\Domain\Exceptions;

use DomainException;

class LeagueNotFoundException extends DomainException
{
    public static function byId(string $leagueId): self
    {
        return new self("Liga no encontrada: {$leagueId}", 404);
    }
}
