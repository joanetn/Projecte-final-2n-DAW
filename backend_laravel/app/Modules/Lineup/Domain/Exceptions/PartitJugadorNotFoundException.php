<?php

/**
 * Excepció de domini: Jugador per Partit no trobat.
 *
 * Es llança quan s'intenta accedir a un registre de PartitJugador
 * que no existeix o ha estat desactivat. Retorna codi HTTP 404.
 */

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

    /**
     * Factory method per crear l'excepció a partir d'un ID.
     */
    public static function withId(string $partitJugadorId): self
    {
        return new self($partitJugadorId);
    }

    /**
     * Retorna l'error en format array per a la resposta JSON.
     */
    public function toArray(): array
    {
        return [
            'error' => 'PARTIT_JUGADOR_NOT_FOUND',
            'message' => $this->getMessage(),
            'code' => $this->getCode()
        ];
    }
}
