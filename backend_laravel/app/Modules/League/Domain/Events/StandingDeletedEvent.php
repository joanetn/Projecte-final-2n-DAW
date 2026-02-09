<?php

namespace App\Modules\League\Domain\Events;

use App\Modules\League\Domain\Entities\Standing;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class StandingDeletedEvent
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly Standing $standing
    ) {}
}
