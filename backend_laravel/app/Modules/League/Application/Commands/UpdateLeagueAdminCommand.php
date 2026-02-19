<?php

namespace App\Modules\League\Application\Commands;

use App\Modules\League\Application\DTOs\UpdateLeagueDTO;
use App\Modules\League\Domain\Exceptions\LeagueNotFoundException;
use App\Modules\League\Domain\Repositories\LeagueRepositoryInterface;
use App\Modules\League\Domain\Services\LeagueDomainService;

class UpdateLeagueAdminCommand
{
    public function __construct(
        private LeagueRepositoryInterface $leagueRepositoryInterface,
        private LeagueDomainService $leagueDomainService
    ) {}

    public function execute(string $leagueId, UpdateLeagueDTO $dto): void
    {
        $league = $this->leagueRepositoryInterface->findByIdIncludingInactive($leagueId);
        if (!$league) {
            throw new LeagueNotFoundException($leagueId);
        }
        if ($dto->dataInici !== null) {
            $this->leagueDomainService->validLeagueIniDate($dto->dataInici);
        }
        if ($dto->dataInici !== null && $dto->dataFi !== null) {
            $this->leagueDomainService->validLeagueEndDate($dto->dataInici, $dto->dataFi);
        }
        $updateData = array_filter([
            'nom' => $dto->nom,
            'categoria' => $dto->categoria,
            'dataInici' => $dto->dataInici,
            'status' => $dto->status,
            'dataFi' => $dto->dataFi,
            'isActive' => $dto->isActive,
            'logo_url' => $dto->logo_url ?? null,
        ], fn($value) => $value !== null);
        $this->leagueRepositoryInterface->update($leagueId, $updateData);
    }
}
