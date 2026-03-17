<?php

namespace App\Modules\Merchandise\Domain\Entities;

class Cart
{
    public function __construct(
        public readonly string $id,
        public readonly string $usuariId,
        public readonly bool $isActive,
        public readonly ?string $createdAt,
        public readonly ?string $updatedAt,
        /** @var array<int, array<string, mixed>>|null */
        public readonly ?array $items = null,
    ) {}
}
