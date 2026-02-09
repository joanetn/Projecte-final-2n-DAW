<?php

namespace App\Modules\User\Domain\Exceptions;

use DomainException;

class InvalidDateBirthException extends DomainException
{
    public static function birthDateInFuture(string $date): self
    {
        return new self("La data de naixement no pot ser posterior a avui: $date");
    }

    public static function userTooYoung(int $minAge = 13): self
    {
        return new self("L'usuari ha de tenir mínim $minAge anys");
    }
}
