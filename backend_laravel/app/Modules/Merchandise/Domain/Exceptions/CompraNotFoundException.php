<?php

namespace App\Modules\Merchandise\Domain\Exceptions;

class CompraNotFoundException extends \DomainException
{
    public function __construct(string $id)
    {
        parent::__construct("Compra no trobada amb id: $id", 404);
    }

    public function toArray(): array
    {
        return [
            'error' => 'CompraNotFoundException',
            'message' => $this->getMessage(),
            'code' => $this->getCode(),
        ];
    }
}
