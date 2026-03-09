<?php

namespace App\Modules\Insurance\Domain\Exceptions;

use DomainException;

class InsuranceNotFoundException extends DomainException
{
    public function __construct()
    {
        parent::__construct(
            message: "Segur no trobat",
            code: 404
        );
    }

    public function toArray(): array
    {
        return [
            'error' => 'INSURANCE_NOT_FOUND',
            'message' => $this->getMessage(),
            'code' => $this->getCode()
        ];
    }
}
