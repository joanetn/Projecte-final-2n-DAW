<?php

namespace App\Modules\Merchandise\Domain\Entities;

class CartItem
{
    public function __construct(
        public readonly string $id,
        public readonly string $cartId,
        public readonly string $merchId,
        public readonly int $quantitat,
        public readonly bool $isActive,
        public readonly ?string $createdAt,
        public readonly ?string $updatedAt,
        /** @var array<string, mixed>|null */
        public readonly ?array $merch = null,
    ) {}
}
