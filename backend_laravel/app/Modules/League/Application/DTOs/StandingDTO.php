<?php

namespace App\Modules\League\Application\DTOs;

class StandingDTO
{
    public function __construct(
        public readonly string $id,
        public readonly string $lligaId,
        public readonly string $equipId,
        public readonly int $partitsJugats = 0,
        public readonly int $partitsGuanyats = 0,
        public readonly int $setsGuanyats = 0,
        public readonly int $setsPerduts = 0,
        public readonly int $jocsGuanyats = 0,
        public readonly int $jocsPerduts = 0,
        public readonly int $punts = 0,
    ) {}
}
