<?php

namespace App\Modules\Match\Domain\Events;

use App\Modules\Match\Domain\Entities\Matches;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MatchDeletedEvent
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly Matches $partit
    ) {}
}
