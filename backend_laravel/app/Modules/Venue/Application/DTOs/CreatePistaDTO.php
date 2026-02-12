<?php

/**
 * DTO per crear una nova Pista dins d'una Instal·lació.
 *
 * Encapsula les dades d'entrada per crear una pista.
 * L'instalacioId és obligatori perquè tota pista pertany a una instal·lació.
 */

namespace App\Modules\Venue\Application\DTOs;

class CreatePistaDTO
{
    public function __construct(
        public readonly string $nom,
        public readonly string $instalacioId,
        public readonly ?string $tipus = null,
    ) {}

    /**
     * Factory method: crea el DTO des de les dades del Request.
     */
    public static function fromArray(array $data): self
    {
        return new self(
            nom: $data['nom'],
            instalacioId: $data['instalacioId'],
            tipus: $data['tipus'] ?? null,
        );
    }
}
