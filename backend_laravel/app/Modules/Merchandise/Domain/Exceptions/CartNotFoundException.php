<?php

namespace App\Modules\Merchandise\Domain\Exceptions;

class CartNotFoundException extends \DomainException
{
    public function __construct(string $usuariId)
    {
        parent::__construct("Carret no trobat per a l'usuari: $usuariId", 404);
    }

    public function toArray(): array
    {
        return [
            'error' => 'CartNotFoundException',
            'message' => $this->getMessage(),
            'code' => $this->getCode(),
        ];
    }
}
