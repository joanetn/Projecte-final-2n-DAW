<?php

/**
 * Excepció de domini: Puntuació no trobada.
 *
 * Es llança quan s'intenta accedir a una puntuació que no existeix
 * o ha estat desactivada. Retorna codi HTTP 404.
 */

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

    /**
     * Factory method per crear l'excepció a partir d'un ID.
     */
    public static function withId(string $puntuacioId): self
    {
        return new self($puntuacioId);
    }

    /**
     * Retorna l'error en format array per a la resposta JSON.
     */
    public function toArray(): array
    {
        return [
            'error' => 'PUNTUACIO_NOT_FOUND',
            'message' => $this->getMessage(),
            'code' => $this->getCode()
        ];
    }
}
