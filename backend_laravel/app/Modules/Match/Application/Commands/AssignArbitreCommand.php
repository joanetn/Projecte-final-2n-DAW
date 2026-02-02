<?php

namespace App\Modules\Match\Application\Commands;

use Illuminate\Support\Facades\Event;
use App\Modules\Match\Domain\Repositories\MatchRepositoryInterface;
use App\Modules\Match\Domain\Services\MatchDomainService;
use App\Modules\Match\Domain\Exceptions\MatchNotFoundException;
use App\Modules\Match\Domain\Events\ArbitreAssignedEvent;

class AssignArbitreCommand
{
    public function __construct(
        private MatchRepositoryInterface $matchRepositoryInterface,
        private MatchDomainService $matchDomainService
    ) {}

    public function execute(string $matchId, string $arbitreId): void
    {
        $match = $this->matchRepositoryInterface->findById($matchId);

        if (!$match) {
            throw new MatchNotFoundException($matchId);
        }

        if (!$this->matchDomainService->canAssignArbitre($match)) {
            throw new \Exception("No es pot assignar arbitre a aquest partit");
        }

        $this->matchRepositoryInterface->update($matchId, ['arbitreId' => $arbitreId]);

        Event::dispatch(new ArbitreAssignedEvent($matchId, $arbitreId));
    }
}
