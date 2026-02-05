<?php

namespace App\Modules\League\Application\DTOs;

class UpdateStandingDTO
{
    public function __construct(
        public readonly ?int $partitsJugats = null,
        public readonly ?int $partitsGuanyats = null,
        public readonly ?int $setsGuanyats = null,
        public readonly ?int $setPerduts = null,
        public readonly ?int $jocsGuanyats = null,
        public readonly ?int $jocsPerduts = null,
        public readonly ?int $punts = null,
        public readonly ?bool $isActive = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            partitsJugats: isset($data['partitsJugats']) ? (int) $data['partitsJugats'] : null,
            partitsGuanyats: isset($data['partitsGuanyats']) ? (int) $data['partitsGuanyats'] : null,
            setsGuanyats: isset($data['setsGuanyats']) ? (int) $data['setsGuanyats'] : null,
            setPerduts: isset($data['setPerduts']) ? (int) $data['setPerduts'] : null,
            jocsGuanyats: isset($data['jocsGuanyats']) ? (int) $data['jocsGuanyats'] : null,
            jocsPerduts: isset($data['jocsPerduts']) ? (int) $data['jocsPerduts'] : null,
            punts: isset($data['punts']) ? (int) $data['punts'] : null,
            isActive: isset($data['isActive']) ? (bool) $data['isActive'] : null,
        );
    }
}
