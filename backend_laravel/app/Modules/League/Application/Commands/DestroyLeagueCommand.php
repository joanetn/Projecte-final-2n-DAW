<?php

namespace App\Modules\League\Application\Commands;

use App\Modules\League\Domain\Events\LeagueDeletedEvent;
use App\Modules\League\Domain\Exceptions\LeagueNotFoundException;
use App\Modules\League\Domain\Repositories\LeagueRepositoryInterface;
use App\Modules\League\Domain\Services\LeagueDomainService;
use Illuminate\Support\Facades\Event;

class DestroyLeagueCommand
{
    public function __construct(
        private LeagueRepositoryInterface $leagueRepositoryInterface,
        private LeagueDomainService $leagueDomainService
    ) {}

    public function execute(string $leagueId): void
    {
        $league = $this->leagueRepositoryInterface->findById($leagueId);

        if (!$league) {
            throw new LeagueNotFoundException($leagueId);
        }

        $this->leagueRepositoryInterface->delete($league->id);

        Event::dispatch(new LeagueDeletedEvent($league));
    }
}
