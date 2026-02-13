<?php

/**
 * Interfície del repositori de PartitJugador (Jugador per Partit).
 *
 * Defineix el contracte per gestionar els jugadors assignats a cada partit.
 * Permet consultar, crear i modificar la participació dels jugadors.
 * Segueix el principi d'Inversió de Dependències (DIP) de SOLID.
 */

namespace App\Modules\Lineup\Domain\Repositories;

use App\Modules\Lineup\Domain\Entities\PartitJugador;

interface PartitJugadorRepositoryInterface
{
    /**
     * Cerca un registre de jugador-partit pel seu ID.
     */
    public function findById(string $id): ?PartitJugador;

    /**
     * Cerca un registre amb relacions carregades.
     */
    public function findByIdWithRelations(string $id, array $relations): ?PartitJugador;

    /**
     * Retorna tots els registres actius de jugadors en partits.
     */
    public function findAll(): array;

    /**
     * Crea un nou registre de jugador en un partit.
     */
    public function create(array $data): PartitJugador;

    /**
     * Actualitza un registre existent.
     */
    public function update(string $id, array $data): bool;

    /**
     * Elimina (soft delete) un registre.
     */
    public function delete(string $id): bool;

    /**
     * Cerca tots els jugadors d'un partit concret.
     */
    public function findByPartit(string $partitId): array;

    /**
     * Cerca tots els partits d'un jugador concret.
     */
    public function findByJugador(string $jugadorId): array;

    /**
     * Cerca els jugadors d'un equip en un partit concret.
     */
    public function findByPartitAndEquip(string $partitId, string $equipId): array;
}
