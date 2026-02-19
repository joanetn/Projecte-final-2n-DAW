<?php

namespace App\Modules\League\Application\Commands;

use App\Modules\League\Domain\Events\LeagueDeletedEvent;
use App\Modules\League\Domain\Exceptions\LeagueNotFoundException;
use App\Modules\League\Domain\Repositories\LeagueRepositoryInterface;
use Illuminate\Support\Facades\Event;

class DestroyLeagueAdminCommand
{
    public function __construct(
        private LeagueRepositoryInterface $leagueRepositoryInterface,
    ) {}

    public function execute(string $leagueId): void
    {
        $league = $this->leagueRepositoryInterface->findByIdIncludingInactive($leagueId);
        if (!$league) {
            throw new LeagueNotFoundException($leagueId);
        }
        $this->leagueRepositoryInterface->delete($league->id);
        Event::dispatch(new LeagueDeletedEvent($league));
    }
}
