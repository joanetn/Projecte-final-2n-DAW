<?php

namespace App\Modules\League\Domain\Events;

use App\Modules\League\Domain\Entities\League;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LeagueDeletedEvent
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly League $league
    ) {}
}
