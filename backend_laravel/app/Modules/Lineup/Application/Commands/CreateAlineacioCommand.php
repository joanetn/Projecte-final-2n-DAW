<?php
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
        $existing = $this->alineacioRepo->findByPartitAndEquip($dto->partitId, $dto->equipId);
        $this->domainService->validateNoDuplicateAlineacio($existing, $dto->jugadorId, $dto->equipId);
        $alineacio = $this->alineacioRepo->create([
            'id' => Str::uuid()->toString(),
            'partitId' => $dto->partitId,
            'jugadorId' => $dto->jugadorId,
            'equipId' => $dto->equipId,
            'posicio' => $dto->posicio,
        ]);
        Event::dispatch(new AlineacioCreatedEvent($alineacio));
        return $alineacio->id;
    }
}
