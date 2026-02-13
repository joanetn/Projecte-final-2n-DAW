<?php
namespace App\Modules\Lineup\Domain\Exceptions;
use DomainException;
class InvalidPuntuacioException extends DomainException
{
    public function __construct(string $message)
    {
        parent::__construct($message, 422);
    }
    public static function negativePunts(int $punts): self
    {
        return new self("Els punts no poden ser negatius: $punts");
    }
    public function toArray(): array
    {
        return [
            'error' => 'INVALID_PUNTUACIO',
            'message' => $this->getMessage(),
            'code' => $this->getCode()
        ];
    }
}
