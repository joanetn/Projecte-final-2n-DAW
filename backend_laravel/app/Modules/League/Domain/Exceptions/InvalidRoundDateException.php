<?php

namespace App\Modules\League\Domain\Exceptions;

use DateTime;

class InvalidRoundDateException extends \Exception
{
    public function __construct(string $message, private ?DateTime $invalidDate = null)
    {
        parent::__construct($message, 422);
    }

    public static function dateInPast(DateTime $date): self
    {
        return new self(
            message: "La data de la jornada no pot ser al passat: {$date->format('Y-m-d H:i')}",
            invalidDate: $date
        );
    }

    public static function dateTooFarInFuture(DateTime $date): self
    {
        return new self(
            message: "La data de la jornada és massa llunyana: {$date->format('Y-m-d H:i')}",
            invalidDate: $date
        );
    }

    public function getInvalidDate(): ?DateTime
    {
        return $this->invalidDate;
    }

    public function toArray(): array
    {
        return [
            'error' => 'INVALID_ROUND_DATE',
            'message' => $this->getMessage(),
            'code' => $this->getCode(),
            'invalid_date' => $this->invalidDate?->format('Y-m-d H:i:s')
        ];
    }
}
