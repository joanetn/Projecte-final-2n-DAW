<?php

/**
 * Interfície del repositori de Puntuacions (Scoring).
 *
 * Defineix el contracte per gestionar les puntuacions dels jugadors.
 * Permet consultar estadístiques individuals i per partit.
 * Segueix el principi d'Inversió de Dependències (DIP) de SOLID.
 */

namespace App\Modules\Lineup\Domain\Repositories;

use App\Modules\Lineup\Domain\Entities\Puntuacio;

interface PuntuacioRepositoryInterface
{
    /**
     * Cerca una puntuació pel seu ID.
     */
    public function findById(string $id): ?Puntuacio;

    /**
     * Cerca una puntuació amb relacions carregades.
     */
    public function findByIdWithRelations(string $id, array $relations): ?Puntuacio;

    /**
     * Retorna totes les puntuacions actives.
     */
    public function findAll(): array;

    /**
     * Crea una nova puntuació.
     */
    public function create(array $data): Puntuacio;

    /**
     * Actualitza una puntuació existent.
     */
    public function update(string $id, array $data): bool;

    /**
     * Elimina (soft delete) una puntuació.
     */
    public function delete(string $id): bool;

    /**
     * Cerca totes les puntuacions d'un partit concret.
     */
    public function findByPartit(string $partitId): array;

    /**
     * Cerca totes les puntuacions d'un jugador concret.
     */
    public function findByJugador(string $jugadorId): array;

    /**
     * Retorna el rànquing de jugadors ordenat per punts totals (descendent).
     */
    public function getRanking(): array;
}
