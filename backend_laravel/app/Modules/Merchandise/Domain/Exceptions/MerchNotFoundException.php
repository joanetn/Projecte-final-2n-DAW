<?php

namespace App\Modules\Merchandise\Domain\Exceptions;

class MerchNotFoundException extends \DomainException
{
    public function __construct(string $id)
    {
        parent::__construct("Producte de merchandising no trobat amb id: $id", 404);
    }

    public function toArray(): array
    {
        return [
            'error' => 'MerchNotFoundException',
            'message' => $this->getMessage(),
            'code' => $this->getCode(),
        ];
    }
}
