<?php

namespace App\Modules\League\Application\Commands;

use App\Modules\League\Application\DTOs\CreateStandingDTO;
use App\Modules\League\Domain\Repositories\StandingRepositoryInterface;
use App\Modules\League\Domain\Services\StandingDomainService;

class CreateStandingCommand
{
    public function __construct(
        private StandingRepositoryInterface $standingRepositoryInterface,
        private StandingDomainService $standingDomainService
    ) {}

    public function execute(CreateStandingDTO $dto): string
    {
        $leagueStandings = $this->standingRepositoryInterface->findByLeague($dto->lligaId);
        $teamAlreadyExists = collect($leagueStandings)->firstWhere('equipId', $dto->equipId) !== null;
        $this->standingDomainService->validateTeamCanJoinLeague($teamAlreadyExists);

        $standing = $this->standingRepositoryInterface->create([
            'lligaId' => $dto->lligaId,
            'equipId' => $dto->equipId,
            'partitsJugats' => 0,
            'partitsGuanyats' => 0,
            'setsGuanyats' => 0,
            'setPerduts' => 0,
            'jocsGuanyats' => 0,
            'jocsPerduts' => 0,
            'punts' => 0,
            'isActive' => true,
        ]);

        return $standing->id;
    }
}
