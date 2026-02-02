<?php

namespace App\Modules\Match\Domain\Exceptions;

use DomainException;
use DateTime;

class InvalidMatchDateException extends DomainException
{
    public function __construct(string $message, private ?DateTime $invalidDate = null)
    {
        parent::__construct($message, 422);
    }

    public static function dateInPast(DateTime $date): self
    {
        return new self(
            message: "La data del partit no pot ser al passat: {$date->format('Y-m-d H:i')}",
            invalidDate: $date
        );
    }

    public static function dateTooFarInFuture(DateTime $date): self
    {
        return new self(
            message: "La data del partit és massa llunyana: {$date->format('Y-m-d H:i')}",
            invalidDate: $date
        );
    }

    public static function invalidHour(DateTime $date): self
    {
        return new self(
            message: "L'hora del partit ha d'estar entre les 8:00 i les 23:00",
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
            'error' => 'INVALID_MATCH_DATE',
            'message' => $this->getMessage(),
            'code' => $this->getCode(),
            'invalid_date' => $this->invalidDate?->format('Y-m-d H:i:s')
        ];
    }
}
