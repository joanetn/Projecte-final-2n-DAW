<?php

/**
 * Excepció de domini: Puntuació invàlida.
 *
 * Es llança quan els punts proporcionats no compleixen les regles de negoci
 * (per exemple, punts negatius). Retorna codi HTTP 422.
 */

namespace App\Modules\Lineup\Domain\Exceptions;

use DomainException;

class InvalidPuntuacioException extends DomainException
{
    public function __construct(string $message)
    {
        parent::__construct($message, 422);
    }

    /**
     * Factory method: punts negatius no permesos.
     */
    public static function negativePunts(int $punts): self
    {
        return new self("Els punts no poden ser negatius: $punts");
    }

    /**
     * Retorna l'error en format array per a la resposta JSON.
     */
    public function toArray(): array
    {
        return [
            'error' => 'INVALID_PUNTUACIO',
            'message' => $this->getMessage(),
            'code' => $this->getCode()
        ];
    }
}
