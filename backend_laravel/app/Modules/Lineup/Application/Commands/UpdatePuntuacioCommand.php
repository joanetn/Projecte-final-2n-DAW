<?php
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
        $puntuacio = $this->puntuacioRepo->findById($puntuacioId);
        if (!$puntuacio) {
            throw new PuntuacioNotFoundException($puntuacioId);
        }
        if (!$this->domainService->canModifyPuntuacio($puntuacio)) {
            throw new \Exception("No es pot modificar una puntuació desactivada");
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
