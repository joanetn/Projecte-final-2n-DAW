<?php

namespace App\Modules\Venue\Domain\Exceptions;

use DomainException;

class PistaNotFoundException extends DomainException
{
    public function __construct()
    {
        parent::__construct(
            message: "Pista no trobada",
            code: 404
        );
    }

    public function toArray(): array
    {
        return [
            'error' => 'PISTA_NOT_FOUND',
            'message' => $this->getMessage(),
            'code' => $this->getCode()
        ];
    }
}
