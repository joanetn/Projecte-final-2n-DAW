<?php

namespace App\Modules\Merchandise\Domain\Exceptions;

class InsufficientStockException extends \DomainException
{
    public function __construct(string $merchId, int $requested, int $available)
    {
        parent::__construct(
            "Estoc insuficient per al producte $merchId. Sol·licitat: $requested, Disponible: $available",
            422
        );
    }

    public function toArray(): array
    {
        return [
            'error' => 'InsufficientStockException',
            'message' => $this->getMessage(),
            'code' => $this->getCode(),
        ];
    }
}
