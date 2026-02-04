<?php

namespace App\Modules\League\Domain\Exceptions;

use DomainException;

class LeagueNotFoundException extends DomainException
{
    public function __construct(string $leagueId)
    {
        parent::__construct(
            message: "Lliga amb ID '$leagueId' no trobada",
            code: 404
        );
    }

    public static function withId(string $leagueId): self
    {
        return new self($leagueId);
    }

    public function toArray(): array
    {
        return [
            'error' => 'LEAGUE_NOT_FOUND',
            'message' => $this->getMessage(),
            'code' => $this->getCode()
        ];
    }
}
