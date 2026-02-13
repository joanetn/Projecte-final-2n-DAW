<?php

namespace App\Modules\Invitation\Domain\Exceptions;

use DomainException;

class DuplicateInvitacioException extends DomainException
{
    public function __construct()
    {
        parent::__construct(
            message: "Ja existeix una invitació pendent per aquest usuari i equip",
            code: 409
        );
    }

    public function toArray(): array
    {
        return [
            'error' => 'DUPLICATE_INVITACIO',
            'message' => $this->getMessage(),
            'code' => $this->getCode()
        ];
    }
}
