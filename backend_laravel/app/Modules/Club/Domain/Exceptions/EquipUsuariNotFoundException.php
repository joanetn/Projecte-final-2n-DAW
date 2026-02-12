<?php

namespace App\Modules\Club\Domain\Exceptions;

use DomainException;

class EquipUsuariNotFoundException extends DomainException
{
    public function __construct()
    {
        parent::__construct(
            message: "Membre d'equip no trobat",
            code: 404
        );
    }

    public function toArray(): array
    {
        return [
            'error' => 'EQUIP_USUARI_NOT_FOUND',
            'message' => $this->getMessage(),
            'code' => $this->getCode()
        ];
    }
}
