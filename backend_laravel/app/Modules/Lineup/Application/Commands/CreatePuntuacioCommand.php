<?php

/**
 * Command per crear una nova Puntuació (Scoring).
 *
 * Executa la lògica de creació:
 * 1. Valida que els punts no siguin negatius via el servei de domini
 * 2. Crea la puntuació al repositori amb un UUID únic
 * 3. Retorna l'ID de la nova puntuació creada
 */

namespace App\Modules\Lineup\Application\Commands;

use App\Modules\Lineup\Application\DTOs\CreatePuntuacioDTO;
use App\Modules\Lineup\Domain\Repositories\PuntuacioRepositoryInterface;
use App\Modules\Lineup\Domain\Services\LineupDomainService;
use Illuminate\Support\Str;

class CreatePuntuacioCommand
{
    public function __construct(
        private PuntuacioRepositoryInterface $puntuacioRepo,
        private LineupDomainService $domainService
    ) {}

    public function execute(CreatePuntuacioDTO $dto): string
    {
        // Validem que els punts siguin correctes (no negatius)
        $this->domainService->validatePuntuacio($dto->punts);

        // Creem la puntuació amb UUID únic
        $puntuacio = $this->puntuacioRepo->create([
            'id' => Str::uuid()->toString(),
            'partitId' => $dto->partitId,
            'jugadorId' => $dto->jugadorId,
            'punts' => $dto->punts,
        ]);

        return $puntuacio->id;
    }
}
