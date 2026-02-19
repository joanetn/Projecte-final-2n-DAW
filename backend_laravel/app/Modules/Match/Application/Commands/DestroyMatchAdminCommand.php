<?php

namespace App\Modules\Match\Application\Commands;

use App\Modules\Match\Domain\Repositories\MatchRepositoryInterface;
use App\Modules\Match\Domain\Exceptions\MatchNotFoundException;
use App\Modules\Match\Domain\Events\MatchDeletedEvent;
use Illuminate\Support\Facades\Event;

class DestroyMatchAdminCommand
{
    public function __construct(
        private MatchRepositoryInterface $matchRepoInterf,
    ) {}

    public function execute(string $matchId): void
    {
        $match = $this->matchRepoInterf->findByIdIncludingInactive($matchId);
        if (!$match) {
            throw new MatchNotFoundException($matchId);
        }
        $this->matchRepoInterf->delete($matchId);
        Event::dispatch(new MatchDeletedEvent($match));
    }
}
