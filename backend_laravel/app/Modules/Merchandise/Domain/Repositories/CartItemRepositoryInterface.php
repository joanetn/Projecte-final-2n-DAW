<?php

namespace App\Modules\Merchandise\Domain\Repositories;

use App\Modules\Merchandise\Domain\Entities\CartItem;

interface CartItemRepositoryInterface
{
    public function findById(string $id): ?CartItem;

    public function findByIdWithRelations(string $id, array $relations = []): ?CartItem;

    public function findByCartAndMerch(string $cartId, string $merchId): ?CartItem;

    public function findByCartAndMerchWithRelations(string $cartId, string $merchId, array $relations = []): ?CartItem;

    public function findByCart(string $cartId): array;

    public function findByCartWithRelations(string $cartId, array $relations = []): array;

    public function create(array $data): string;

    public function update(string $id, array $data): void;

    public function delete(string $id): void;

    public function deleteByCart(string $cartId): void;
}
