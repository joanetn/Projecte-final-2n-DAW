<?php

namespace App\Modules\Merchandise\Domain\Exceptions;

class CartEmptyException extends \DomainException
{
    public function __construct()
    {
        parent::__construct('El carret està buit', 422);
    }

    public function toArray(): array
    {
        return [
            'error' => 'CartEmptyException',
            'message' => $this->getMessage(),
            'code' => $this->getCode(),
        ];
    }
}
