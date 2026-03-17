<?php

namespace App\Modules\Merchandise\Domain\Exceptions;

class CartItemNotFoundException extends \DomainException
{
    public function __construct(string $id)
    {
        parent::__construct("Element del carret no trobat amb id: $id", 404);
    }

    public function toArray(): array
    {
        return [
            'error' => 'CartItemNotFoundException',
            'message' => $this->getMessage(),
            'code' => $this->getCode(),
        ];
    }
}
