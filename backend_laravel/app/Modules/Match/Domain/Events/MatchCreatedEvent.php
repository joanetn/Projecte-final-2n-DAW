<?php

namespace Modules\Match\Domain\Events;

use Modules\Match\Domain\Entities\Matches;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PartitCreatedEvent
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly Matches $partit
    ) {
    }
}