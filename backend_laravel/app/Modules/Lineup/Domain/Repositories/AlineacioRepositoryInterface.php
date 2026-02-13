<?php

/**
 * Interfície del repositori d'Alineacions.
 *
 * Defineix el contracte que ha de complir qualsevol implementació
 * del repositori d'alineacions (Eloquent, API externa, etc.).
 * Segueix el principi d'Inversió de Dependències (DIP) de SOLID.
 */

namespace App\Modules\Lineup\Domain\Repositories;

use App\Modules\Lineup\Domain\Entities\Alineacio;

interface AlineacioRepositoryInterface
{
    /**
     * Cerca una alineació pel seu ID.
     */
    public function findById(string $id): ?Alineacio;

    /**
     * Cerca una alineació pel seu ID amb relacions carregades.
     */
    public function findByIdWithRelations(string $id, array $relations): ?Alineacio;

    /**
     * Retorna totes les alineacions actives.
     */
    public function findAll(): array;

    /**
     * Crea una nova alineació.
     */
    public function create(array $data): Alineacio;

    /**
     * Actualitza una alineació existent.
     */
    public function update(string $id, array $data): bool;

    /**
     * Elimina (soft delete) una alineació.
     */
    public function delete(string $id): bool;

    /**
     * Cerca totes les alineacions d'un partit concret.
     */
    public function findByPartit(string $partitId): array;

    /**
     * Cerca totes les alineacions d'un equip concret.
     */
    public function findByEquip(string $equipId): array;

    /**
     * Cerca totes les alineacions d'un jugador concret.
     */
    public function findByJugador(string $jugadorId): array;

    /**
     * Cerca les alineacions d'un equip en un partit concret.
     */
    public function findByPartitAndEquip(string $partitId, string $equipId): array;
}
