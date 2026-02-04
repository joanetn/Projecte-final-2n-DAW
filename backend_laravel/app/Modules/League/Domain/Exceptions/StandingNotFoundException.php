<?php

namespace App\Modules\League\Domain\Exceptions;

class StandingNotFoundException extends \DomainException
{
    public function __construct(string $standingId)
    {
        parent::__construct(
            message: "Classificació amb ID '$standingId' no trobada",
            code: 404
        );
    }

    public static function withId(string $standingId): self
    {
        return new self($standingId);
    }

    public function toArray(): array
    {
        return [
            'error' => 'STANDING_NOT_FOUND',
            'message' => $this->getMessage(),
            'code' => $this->getCode()
        ];
    }
}
