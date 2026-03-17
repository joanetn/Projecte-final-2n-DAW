<?php

namespace App\Modules\Merchandise\Domain\Repositories;

use App\Modules\Merchandise\Domain\Entities\Cart;

interface CartRepositoryInterface
{
    public function findAll(): array;

    public function findAllWithRelations(array $relations = []): array;

    public function findById(string $id): ?Cart;

    public function findByIdWithRelations(string $id, array $relations = []): ?Cart;

    public function findActiveByUsuari(string $usuariId): ?Cart;

    public function findActiveByUsuariWithRelations(string $usuariId, array $relations = []): ?Cart;

    public function create(array $data): string;

    public function update(string $id, array $data): void;

    public function delete(string $id): void;
}
