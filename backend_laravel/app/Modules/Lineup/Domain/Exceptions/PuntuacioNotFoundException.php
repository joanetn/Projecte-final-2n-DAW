<?php
namespace App\Modules\Lineup\Domain\Exceptions;
use DomainException;
class PuntuacioNotFoundException extends DomainException
{
    public function __construct(string $puntuacioId)
    {
        parent::__construct(
            message: "Puntuació amb ID '$puntuacioId' no trobada",
            code: 404
        );
    }
    public static function withId(string $puntuacioId): self
    {
        return new self($puntuacioId);
    }
    public function toArray(): array
    {
        return [
            'error' => 'PUNTUACIO_NOT_FOUND',
            'message' => $this->getMessage(),
            'code' => $this->getCode()
        ];
    }
}
