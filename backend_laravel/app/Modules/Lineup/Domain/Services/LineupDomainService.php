<?php
namespace App\Modules\Lineup\Domain\Services;
use App\Modules\Lineup\Domain\Entities\Alineacio;
use App\Modules\Lineup\Domain\Entities\Puntuacio;
use App\Modules\Lineup\Domain\Exceptions\DuplicateAlineacioException;
use App\Modules\Lineup\Domain\Exceptions\InvalidPuntuacioException;
class LineupDomainService
{
    public function validateNoDuplicateAlineacio(array $existingAlineacions, string $jugadorId, string $equipId): void
    {
        foreach ($existingAlineacions as $alineacio) {
            if ($alineacio->jugadorId === $jugadorId && $alineacio->equipId === $equipId) {
                throw DuplicateAlineacioException::forJugadorInPartit($jugadorId);
            }
        }
    }
    public function validatePuntuacio(int $punts): void
    {
        if ($punts < 0) {
            throw InvalidPuntuacioException::negativePunts($punts);
        }
    }
    public function canModifyAlineacio(Alineacio $alineacio): bool
    {
        return $alineacio->isActive();
    }
    public function canModifyPuntuacio(Puntuacio $puntuacio): bool
    {
        return $puntuacio->isActive();
    }
}
