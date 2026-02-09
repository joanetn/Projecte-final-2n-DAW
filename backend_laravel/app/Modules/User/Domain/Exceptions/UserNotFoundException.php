<?php

namespace App\Modules\User\Domain\Exceptions;

use DomainException;

class UserNotFoundException extends DomainException
{
    public function __construct()
    {
        parent::__construct(
            message: "Usuari no trobat",
            code: 404
        );
    }

    public function toArray(): array
    {
        return [
            'error' => 'USER_NOT_FOUND',
            'message' => $this->getMessage(),
            'code' => $this->getCode()
        ];
    }
}
