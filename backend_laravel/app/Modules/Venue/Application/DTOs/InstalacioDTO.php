<?php

/**
 * DTO d'Instal·lació per a respostes.
 *
 * Data Transfer Object que encapsula les dades d'una Instal·lació
 * per retornar al client. Converteix l'entitat de domini a un format
 * segur per transportar (sense lògica de negoci).
 * Patró DTO del CQRS per separar lectura d'escriptura.
 */

namespace App\Modules\Venue\Application\DTOs;

use App\Modules\Venue\Domain\Entities\Instalacio;

class InstalacioDTO
{
    public function __construct(
        public readonly string $id,
        public readonly string $nom,
        public readonly ?string $adreca = null,
        public readonly ?string $telefon = null,
        public readonly ?string $tipusPista = null,
        public readonly ?int $numPistes = null,
        public readonly ?string $clubId = null,
        public readonly bool $isActive = true,
        public readonly string $createdAt = '',
        public readonly string $updatedAt = '',
    ) {}

    /**
     * Crea un DTO a partir d'una entitat de domini.
     * Separa la capa d'aplicació del domini.
     */
    public static function fromEntity(Instalacio $instalacio): self
    {
        return new self(
            id: $instalacio->id,
            nom: $instalacio->nom,
            adreca: $instalacio->adreca,
            telefon: $instalacio->telefon,
            tipusPista: $instalacio->tipusPista,
            numPistes: $instalacio->numPistes,
            clubId: $instalacio->clubId,
            isActive: $instalacio->isActive,
            createdAt: $instalacio->createdAt ?? date('Y-m-d H:i:s'),
            updatedAt: $instalacio->updatedAt ?? date('Y-m-d H:i:s'),
        );
    }
}
