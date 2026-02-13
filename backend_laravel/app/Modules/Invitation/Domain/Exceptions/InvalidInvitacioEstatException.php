<?php

namespace App\Modules\Invitation\Domain\Exceptions;

use DomainException;

class InvalidInvitacioEstatException extends DomainException
{
    public function __construct(string $estat)
    {
        parent::__construct(
            message: "L'estat '$estat' no és vàlid per a una invitació",
            code: 422
        );
    }

    public function toArray(): array
    {
        return [
            'error' => 'INVALID_INVITACIO_ESTAT',
            'message' => $this->getMessage(),
            'code' => $this->getCode()
        ];
    }
}
