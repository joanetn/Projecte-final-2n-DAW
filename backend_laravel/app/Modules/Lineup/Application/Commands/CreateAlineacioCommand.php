<?php

/**
 * Command per crear una nova Alineació.
 *
 * Executa la lògica de creació d'una alineació:
 * 1. Valida que no hi hagi duplicats (un jugador no pot estar 2 vegades al mateix equip/partit)
 * 2. Crea l'alineació al repositori amb un UUID únic
 * 3. Dispara l'event AlineacioCreatedEvent per notificar altres mòduls
 */

namespace App\Modules\Lineup\Application\Commands;

use App\Modules\Lineup\Application\DTOs\CreateAlineacioDTO;
use App\Modules\Lineup\Domain\Repositories\AlineacioRepositoryInterface;
use App\Modules\Lineup\Domain\Events\AlineacioCreatedEvent;
use App\Modules\Lineup\Domain\Services\LineupDomainService;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;

class CreateAlineacioCommand
{
    public function __construct(
        private AlineacioRepositoryInterface $alineacioRepo,
        private LineupDomainService $domainService
    ) {}

    public function execute(CreateAlineacioDTO $dto): string
    {
        // Obtenim les alineacions existents del partit+equip per validar duplicats
        $existing = $this->alineacioRepo->findByPartitAndEquip($dto->partitId, $dto->equipId);
        $this->domainService->validateNoDuplicateAlineacio($existing, $dto->jugadorId, $dto->equipId);

        // Creem l'alineació amb un UUID únic
        $alineacio = $this->alineacioRepo->create([
            'id' => Str::uuid()->toString(),
            'partitId' => $dto->partitId,
            'jugadorId' => $dto->jugadorId,
            'equipId' => $dto->equipId,
            'posicio' => $dto->posicio,
        ]);

        // Disparem l'event per informar a altres mòduls
        Event::dispatch(new AlineacioCreatedEvent($alineacio));

        return $alineacio->id;
    }
}
