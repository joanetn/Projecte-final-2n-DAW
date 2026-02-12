<?php

namespace App\Modules\Club\Domain\Exceptions;

use DomainException;

class ClubNotFoundException extends DomainException
{
    public function __construct()
    {
        parent::__construct(
            message: "Club no trobat",
            code: 404
        );
    }

    public function toArray(): array
    {
        return [
            'error' => 'CLUB_NOT_FOUND',
            'message' => $this->getMessage(),
            'code' => $this->getCode()
        ];
    }
}
