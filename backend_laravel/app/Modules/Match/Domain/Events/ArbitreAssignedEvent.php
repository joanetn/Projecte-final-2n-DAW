<?php

namespace Modules\Match\Domain\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ArbitreAssignedEvent
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly string $partitId,
        public readonly string $arbitreId
    ) {
    }
}