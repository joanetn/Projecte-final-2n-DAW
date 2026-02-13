<?php
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
        $this->domainService->validatePuntuacio($dto->punts);
        $puntuacio = $this->puntuacioRepo->create([
            'id' => Str::uuid()->toString(),
            'partitId' => $dto->partitId,
            'jugadorId' => $dto->jugadorId,
            'punts' => $dto->punts,
        ]);
        return $puntuacio->id;
    }
}
