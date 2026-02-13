<?php

/**
 * Excepció de domini: Alineació no trobada.
 *
 * Es llança quan s'intenta accedir a una alineació que no existeix
 * o ha estat desactivada (soft delete). Retorna codi HTTP 404.
 */

namespace App\Modules\Lineup\Domain\Exceptions;

use DomainException;

class AlineacioNotFoundException extends DomainException
{
    public function __construct(string $alineacioId)
    {
        parent::__construct(
            message: "Alineació amb ID '$alineacioId' no trobada",
            code: 404
        );
    }

    /**
     * Factory method per crear l'excepció a partir d'un ID.
     */
    public static function withId(string $alineacioId): self
    {
        return new self($alineacioId);
    }

    /**
     * Retorna l'error en format array per a la resposta JSON.
     */
    public function toArray(): array
    {
        return [
            'error' => 'ALINEACIO_NOT_FOUND',
            'message' => $this->getMessage(),
            'code' => $this->getCode()
        ];
    }
}
