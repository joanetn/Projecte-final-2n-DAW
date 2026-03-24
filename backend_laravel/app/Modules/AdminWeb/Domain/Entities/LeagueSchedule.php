<?php

namespace App\Modules\AdminWeb\Domain\Entities;

class LeagueSchedule
{
    public function __construct(
        public readonly string $lligaId,
        public readonly string $lligaNom,
        public readonly int $equipCount,
        public readonly int $jornadesGenerades,
        public readonly int $partitsGenerats,
        public readonly bool $rerandomized,
        public readonly string $message,
    ) {}

    public function toArray(): array
    {
        return [
            'lligaId' => $this->lligaId,
            'lligaNom' => $this->lligaNom,
            'equipCount' => $this->equipCount,
            'jornadesGenerades' => $this->jornadesGenerades,
            'partitsGenerats' => $this->partitsGenerats,
            'rerandomized' => $this->rerandomized,
            'message' => $this->message,
        ];
    }
}
