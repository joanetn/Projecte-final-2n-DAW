<?php

namespace App\Modules\League\Application\Commands;

use App\Modules\League\Application\DTOs\CreateLeagueDTO;
use App\Modules\League\Domain\Repositories\LeagueRepositoryInterface;
use App\Modules\League\Domain\Services\LeagueDomainService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Modules\Notifications\Application\DTOs\EnqueueNotificationDTO;

class CreateLeagueCommand
{
    public function __construct(
        private LeagueRepositoryInterface $leagueRepositoryInterface,
        private LeagueDomainService $leagueDomainService
    ) {}

    public function execute(CreateLeagueDTO $dto): string
    {
        $this->leagueDomainService->validLeagueIniDate($dto->dataInici);
        $this->leagueDomainService->validLeagueEndDate($dto->dataInici, $dto->dataFi);

        $league = $this->leagueRepositoryInterface->create([
            'id' => Str::uuid()->toString(),
            'nom' => $dto->nom,
            'categoria' => $dto->categoria,
            'dataInici' => $dto->dataInici,
            'status' => $dto->status,
            'dataFi' => $dto->dataFi,
            'isActive' => $dto->isActive,
        ]);

        return $league->id;
    }

    public function dispatchLeagueNotification(CreateLeagueDTO $dto): void
    {
        try {
            $suceso = "Se ha creado una lliga nueva con el nombre: {$dto->nom} de la categoria: {$dto->categoria} que inicia el: {$dto->dataInici}";

            $enqueueDto = EnqueueNotificationDTO::fromArray([]);
        } catch (\Throwable $e) {
            Log::error('Error enviando notificación de creación de liga', [
                'error' => $e->getMessage(),
            ]);
        }
    }
}
