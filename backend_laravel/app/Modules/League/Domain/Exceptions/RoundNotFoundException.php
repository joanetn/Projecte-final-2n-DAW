<?php

namespace App\Modules\League\Domain\Exceptions;

class RoundNotFoundException extends \DomainException
{
    public function __construct(string $roundId)
    {
        parent::__construct(
            message: "Jornada amb ID '$roundId' no trobada",
            code: 404
        );
    }

    public static function withId(string $roundId): self
    {
        return new self($roundId);
    }

    public function toArray(): array
    {
        return [
            'error' => 'ROUND_NOT_FOUND',
            'message' => $this->getMessage(),
            'code' => $this->getCode()
        ];
    }
}
