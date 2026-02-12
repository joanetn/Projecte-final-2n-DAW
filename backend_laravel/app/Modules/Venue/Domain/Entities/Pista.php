<?php

namespace App\Modules\Venue\Domain\Entities;

class Pista
{
    public function __construct(
        public readonly string $id,
        public readonly string $nom,
        public readonly ?string $tipus = null,
        public readonly string $instalacioId = '',
        public readonly bool $isActive = true,
        public readonly ?string $createdAt = null,
        public readonly ?string $updatedAt = null,
    ) {}
}
