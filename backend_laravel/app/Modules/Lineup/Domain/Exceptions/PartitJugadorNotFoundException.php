<?php
namespace App\Modules\Lineup\Domain\Exceptions;
use DomainException;
class PartitJugadorNotFoundException extends DomainException
{
    public function __construct(string $partitJugadorId)
    {
        parent::__construct(
            message: "Jugador de partit amb ID '$partitJugadorId' no trobat",
            code: 404
        );
    }
    public static function withId(string $partitJugadorId): self
    {
        return new self($partitJugadorId);
    }
    public function toArray(): array
    {
        return [
            'error' => 'PARTIT_JUGADOR_NOT_FOUND',
            'message' => $this->getMessage(),
            'code' => $this->getCode()
        ];
    }
}
