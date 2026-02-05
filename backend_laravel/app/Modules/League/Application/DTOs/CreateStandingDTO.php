<?php

namespace App\Modules\League\Application\DTOs;

class CreateStandingDTO
{
    public function __construct(
        public readonly string $lligaId,
        public readonly string $equipId,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            lligaId: $data['lligaId'],
            equipId: $data['equipId'],
        );
    }
}
