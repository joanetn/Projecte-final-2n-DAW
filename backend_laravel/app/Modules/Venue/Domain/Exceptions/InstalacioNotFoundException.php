<?php

namespace App\Modules\Venue\Domain\Exceptions;

use DomainException;

class InstalacioNotFoundException extends DomainException
{
    public function __construct()
    {
        parent::__construct(
            message: "Instal·lació no trobada",
            code: 404
        );
    }

    public function toArray(): array
    {
        return [
            'error' => 'INSTALACIO_NOT_FOUND',
            'message' => $this->getMessage(),
            'code' => $this->getCode()
        ];
    }
}
