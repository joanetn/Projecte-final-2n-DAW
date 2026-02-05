<?php

namespace App\Modules\League\Domain\Entities;

class Standing
{
    public function __construct(
        public readonly string $id,
        public readonly ?object $lliga,
        public readonly string $lligaId,
        public readonly ?object $equip,
        public readonly string $equipId,
        public readonly int $partitsJugats = 0,
        public readonly int $partitsGuanyats = 0,
        public readonly int $setsGuanyats = 0,
        public readonly int $setPerduts = 0,
        public readonly int $jocsGuanyats = 0,
        public readonly int $jocsPerduts = 0,
        public readonly int $punts = 0,
        public readonly bool $isActive,
        public readonly string $createdAt,
        public readonly string $updatedAt,
    ) {}

    public function isActive(): bool
    {
        return $this->isActive;
    }
}
