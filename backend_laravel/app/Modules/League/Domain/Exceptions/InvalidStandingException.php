<?php

namespace App\Modules\League\Domain\Exceptions;

use Exception;

class InvalidStandingException extends Exception
{
    public function __construct(string $message)
    {
        parent::__construct($message);
    }
}
