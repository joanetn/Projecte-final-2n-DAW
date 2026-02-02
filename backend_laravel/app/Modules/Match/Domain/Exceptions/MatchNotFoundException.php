<?php

namespace App\Modules\Match\Domain\Exceptions;

use DomainException;

class MatchNotFoundException extends DomainException
{
    public function __construct(string $matchId)
    {
        parent::__construct(
            message: "Partit amd ID '$matchId' no trobat",
            code: 404
        );
    }

    public static function withId(string $matchId): self
    {
        return new self($matchId);
    }

    public function toArray(): array
    {
        return [
            'error' => 'MATCH_NOT_FOUND',
            'message' => $this->getMessage(),
            'code' => $this->getCode()
        ];
    }
}
