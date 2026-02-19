<?php

namespace App\Modules\Lineup\Application\Commands;

use App\Modules\Lineup\Application\DTOs\UpdatePuntuacioDTO;
use App\Modules\Lineup\Domain\Repositories\PuntuacioRepositoryInterface;
use App\Modules\Lineup\Domain\Services\LineupDomainService;
use App\Modules\Lineup\Domain\Exceptions\PuntuacioNotFoundException;
use App\Modules\Lineup\Domain\Events\PuntuacioUpdatedEvent;
use Illuminate\Support\Facades\Event;

class UpdatePuntuacioAdminCommand
{
    public function __construct(
        private PuntuacioRepositoryInterface $puntuacioRepo,
        private LineupDomainService $domainService
    ) {}

    public function execute(string $puntuacioId, UpdatePuntuacioDTO $dto): void
    {
        $puntuacio = $this->puntuacioRepo->findByIdIncludingInactive($puntuacioId);
        if (!$puntuacio) {
            throw new PuntuacioNotFoundException($puntuacioId);
        }

        if ($dto->punts !== null) {
            $this->domainService->validatePuntuacio($dto->punts);
        }

        $updateData = array_filter([
            'punts' => $dto->punts,
            'isActive' => $dto->isActive,
        ], fn($value) => $value !== null);

        $this->puntuacioRepo->update($puntuacioId, $updateData);

        if ($dto->punts !== null) {
            Event::dispatch(new PuntuacioUpdatedEvent(
                $puntuacioId,
                $puntuacio->jugadorId,
                $dto->punts
            ));
        }
    }
}
