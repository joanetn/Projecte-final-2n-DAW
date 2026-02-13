<?php

namespace App\Modules\Invitation\Domain\Exceptions;

use DomainException;

class InvitacioEquipNotFoundException extends DomainException
{
    public function __construct()
    {
        parent::__construct(
            message: "Invitació d'equip no trobada",
            code: 404
        );
    }

    public function toArray(): array
    {
        return [
            'error' => 'INVITACIO_EQUIP_NOT_FOUND',
            'message' => $this->getMessage(),
            'code' => $this->getCode()
        ];
    }
}
