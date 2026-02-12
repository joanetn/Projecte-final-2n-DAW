<?php

namespace App\Modules\Club\Domain\Exceptions;

use DomainException;

class EquipNotFoundException extends DomainException
{
    public function __construct()
    {
        parent::__construct(
            message: "Equip no trobat",
            code: 404
        );
    }

    public function toArray(): array
    {
        return [
            'error' => 'EQUIP_NOT_FOUND',
            'message' => $this->getMessage(),
            'code' => $this->getCode()
        ];
    }
}
