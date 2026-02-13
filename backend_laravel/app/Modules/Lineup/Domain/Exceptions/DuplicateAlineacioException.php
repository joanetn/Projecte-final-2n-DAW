<?php

/**
 * Excepció de domini: Alineació duplicada.
 *
 * Es llança quan s'intenta afegir un jugador a una alineació
 * on ja està present. Evita duplicats en el mateix partit/equip.
 * Retorna codi HTTP 422 (Unprocessable Entity).
 */

namespace App\Modules\Lineup\Domain\Exceptions;

use DomainException;

class DuplicateAlineacioException extends DomainException
{
    public function __construct(string $message)
    {
        parent::__construct($message, 422);
    }

    /**
     * Factory method: jugador ja existeix en el partit.
     */
    public static function forJugadorInPartit(string $jugadorId): self
    {
        return new self("El jugador amb ID '$jugadorId' ja està alineat en aquest partit");
    }

    /**
     * Retorna l'error en format array per a la resposta JSON.
     */
    public function toArray(): array
    {
        return [
            'error' => 'DUPLICATE_ALINEACIO',
            'message' => $this->getMessage(),
            'code' => $this->getCode()
        ];
    }
}
