<?php
namespace App\Modules\Lineup\Domain\Exceptions;
use DomainException;
class DuplicateAlineacioException extends DomainException
{
    public function __construct(string $message)
    {
        parent::__construct($message, 422);
    }
    public static function forJugadorInPartit(string $jugadorId): self
    {
        return new self("El jugador amb ID '$jugadorId' ja està alineat en aquest partit");
    }
    public function toArray(): array
    {
        return [
            'error' => 'DUPLICATE_ALINEACIO',
            'message' => $this->getMessage(),
            'code' => $this->getCode()
        ];
    }
}
