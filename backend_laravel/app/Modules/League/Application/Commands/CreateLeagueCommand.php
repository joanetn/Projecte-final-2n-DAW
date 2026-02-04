<?php

namespace App\Modules\League\Application\Commands;

use App\Modules\League\Application\DTOs\CreateLeagueDTO;
use App\Modules\League\Domain\Repositories\LeagueRepositoryInterface;
use App\Modules\League\Domain\Services\LeagueDomainService;

class CreateLeagueCommand
{
    public function __construct(
        private LeagueRepositoryInterface $leagueRepositoryInterface,
        private LeagueDomainService $leagueDomainService
    ) {}

    public function execute(CreateLeagueDTO $dto): string
    {
        $this->leagueDomainService->validLeagueDate($dto->dataInici);

        $league = $this->leagueRepositoryInterface->create([
            'nom' => $dto->nom,
            'categoria' => $dto->categoria,
            'dataInici' => $dto->dataInici,
            'status' => $dto->status,
            'dataFi' => $dto->dataFi,
        ]);

        return $league->id;
    }
}
