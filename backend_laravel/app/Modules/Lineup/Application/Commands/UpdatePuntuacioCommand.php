<?php

/**
 * Command per actualitzar una Puntuació existent.
 *
 * Executa la lògica d'actualització:
 * 1. Busca la puntuació pel seu ID (llança excepció si no existeix)
 * 2. Verifica que es pugui modificar (que estigui activa)
 * 3. Valida els punts si s'han proporcionat
 * 4. Actualitza només els camps proporcionats (patch parcial)
 * 5. Dispara l'event PuntuacioUpdatedEvent si s'actualitzen punts
 */

namespace App\Modules\Lineup\Application\Commands;

use App\Modules\Lineup\Application\DTOs\UpdatePuntuacioDTO;
use App\Modules\Lineup\Domain\Repositories\PuntuacioRepositoryInterface;
use App\Modules\Lineup\Domain\Services\LineupDomainService;
use App\Modules\Lineup\Domain\Exceptions\PuntuacioNotFoundException;
use App\Modules\Lineup\Domain\Events\PuntuacioUpdatedEvent;
use Illuminate\Support\Facades\Event;

class UpdatePuntuacioCommand
{
    public function __construct(
        private PuntuacioRepositoryInterface $puntuacioRepo,
        private LineupDomainService $domainService
    ) {}

    public function execute(string $puntuacioId, UpdatePuntuacioDTO $dto): void
    {
        // Busquem la puntuació, si no existeix llancem excepció 404
        $puntuacio = $this->puntuacioRepo->findById($puntuacioId);

        if (!$puntuacio) {
            throw new PuntuacioNotFoundException($puntuacioId);
        }

        // Verifiquem que es pot modificar (activa)
        if (!$this->domainService->canModifyPuntuacio($puntuacio)) {
            throw new \Exception("No es pot modificar una puntuació desactivada");
        }

        // Validem els punts si s'han proporcionat
        if ($dto->punts !== null) {
            $this->domainService->validatePuntuacio($dto->punts);
        }

        // Filtrem només els camps no nuls per fer patch parcial
        $updateData = array_filter([
            'punts' => $dto->punts,
            'isActive' => $dto->isActive,
        ], fn($value) => $value !== null);

        $this->puntuacioRepo->update($puntuacioId, $updateData);

        // Si s'han actualitzat punts, disparem l'event
        if ($dto->punts !== null) {
            Event::dispatch(new PuntuacioUpdatedEvent(
                $puntuacioId,
                $puntuacio->jugadorId,
                $dto->punts
            ));
        }
    }
}
