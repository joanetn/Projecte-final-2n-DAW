<?php

namespace App\Modules\League\Application\Commands;

use App\Modules\League\Domain\Events\StandingDeletedEvent;
use App\Modules\League\Domain\Exceptions\StandingNotFoundException;
use App\Modules\League\Domain\Repositories\StandingRepositoryInterface;
use App\Modules\League\Domain\Services\StandingDomainService;
use Illuminate\Support\Facades\Event;

class DestroyStandingCommand
{
    public function __construct(
        private StandingRepositoryInterface $standingRepositoryInterface,
        private StandingDomainService $standingDomainService
    ) {}

    public function execute(string $standingId): void
    {
        $standing = $this->standingRepositoryInterface->findById($standingId);

        if (!$standing) {
            throw new StandingNotFoundException(standingId: $standingId);
        }

        $this->standingRepositoryInterface->delete(id: $standing->id);

        Event::dispatch(event: new StandingDeletedEvent(standing: $standing));
    }
}
