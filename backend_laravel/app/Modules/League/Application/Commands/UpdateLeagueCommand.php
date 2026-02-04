<?php

namespace App\Modules\League\Application\Commands;

use App\Modules\League\Application\DTOs\UpdateLeagueDTO;
use App\Modules\League\Domain\Exceptions\LeagueNotFoundException;
use App\Modules\League\Domain\Repositories\LeagueRepositoryInterface;
use App\Modules\League\Domain\Services\LeagueDomainService;

class UpdateLeagueCommand
{
    public function __construct(
        private LeagueRepositoryInterface $leagueRepositoryInterface,
        private LeagueDomainService $leagueDomainService
    ) {}

    public function execute(string $leagueId, UpdateLeagueDTO $dto): void
    {
        $league = $this->leagueRepositoryInterface->findById($leagueId);

        if (!$league) {
            throw new LeagueNotFoundException($leagueId);
        }

        if (!$this->leagueDomainService->canStartLeague($league)) {
            throw new \Exception("No es pot iniciar una lliga sense mínim 2 equips");
        }

        if ($dto->dataInici !== null) {
            $this->leagueDomainService->validLeagueDate($dto->dataInici);
        }

        $updateData = array_filter([
            'nom' => $dto->nom,
            'categoria' => $dto->categoria,
            'dataInici' => $dto->dataInici,
            'status' => $dto->status,
            'dataFi' => $dto->dataFi,
        ], fn($value) => $value !== null);

        $this->leagueRepositoryInterface->update($leagueId, $updateData);
    }
}
