<?php

namespace App\Modules\League\Application\Commands;

use App\Modules\League\Domain\Events\RoundDeletedEvent;
use App\Modules\League\Domain\Exceptions\RoundNotFoundException;
use App\Modules\League\Domain\Repositories\RoundRepositoryInterface;
use App\Modules\League\Domain\Services\RoundDomainService;
use Illuminate\Support\Facades\Event;

class DestroyRoundCommand
{

    public function __construct(
        private RoundRepositoryInterface $roundRepositoryInterface,
        private RoundDomainService $roundDomainService
    ) {}

    public function execute(string $roundId): void
    {
        $round = $this->roundRepositoryInterface->findById(id: $roundId);

        if (!$round) {
            throw new RoundNotFoundException(roundId: $roundId);
        }

        $this->roundRepositoryInterface->delete(id: $round->id);

        Event::dispatch(event: new RoundDeletedEvent(round: $round));
    }
}
