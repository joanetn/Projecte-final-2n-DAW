<?php

/**
 * Servei de domini per a Alineacions i Puntuacions.
 *
 * Conté la lògica de negoci pura que no pertany a cap entitat individual.
 * Valida regles de negoci com duplicats d'alineació, límits de jugadors,
 * i coherència de puntuacions.
 */

namespace App\Modules\Lineup\Domain\Services;

use App\Modules\Lineup\Domain\Entities\Alineacio;
use App\Modules\Lineup\Domain\Entities\Puntuacio;
use App\Modules\Lineup\Domain\Exceptions\DuplicateAlineacioException;
use App\Modules\Lineup\Domain\Exceptions\InvalidPuntuacioException;

class LineupDomainService
{
    /**
     * Valida que un jugador no estigui ja alineat en el mateix partit i equip.
     * Un jugador no pot estar dues vegades a la mateixa alineació.
     *
     * @param array $existingAlineacions Alineacions actuals del partit
     * @param string $jugadorId ID del jugador a afegir
     * @param string $equipId ID de l'equip
     */
    public function validateNoDuplicateAlineacio(array $existingAlineacions, string $jugadorId, string $equipId): void
    {
        foreach ($existingAlineacions as $alineacio) {
            if ($alineacio->jugadorId === $jugadorId && $alineacio->equipId === $equipId) {
                throw DuplicateAlineacioException::forJugadorInPartit($jugadorId);
            }
        }
    }

    /**
     * Valida que els punts d'una puntuació no siguin negatius.
     * Els punts han de ser un valor vàlid (>= 0).
     *
     * @param int $punts Punts a validar
     */
    public function validatePuntuacio(int $punts): void
    {
        if ($punts < 0) {
            throw InvalidPuntuacioException::negativePunts($punts);
        }
    }

    /**
     * Comprova si un jugador pot ser afegit a una alineació.
     * Verifica que l'alineació estigui activa i no hi hagi conflictes.
     *
     * @param Alineacio $alineacio Alineació a verificar
     */
    public function canModifyAlineacio(Alineacio $alineacio): bool
    {
        return $alineacio->isActive();
    }

    /**
     * Comprova si es pot modificar una puntuació.
     * Només es poden modificar puntuacions actives.
     *
     * @param Puntuacio $puntuacio Puntuació a verificar
     */
    public function canModifyPuntuacio(Puntuacio $puntuacio): bool
    {
        return $puntuacio->isActive();
    }
}
