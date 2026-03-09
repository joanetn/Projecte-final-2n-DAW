<?php

namespace App\Modules\Insurance\Domain\Exceptions;

use DomainException;

class InvalidInsuranceDateException extends DomainException
{
    public static function insuranceDateExpired(): self
    {
        return new self("La data de expiració és anterior a la de avui, t'ha expirat el segur");
    }
}
