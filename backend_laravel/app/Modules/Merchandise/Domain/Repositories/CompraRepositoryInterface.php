<?php

namespace App\Modules\Merchandise\Domain\Repositories;

use App\Modules\Merchandise\Domain\Entities\Compra;

interface CompraRepositoryInterface
{
    public function findAll(): array;

    public function findAllWithRelations(array $relations = []): array;

    public function findById(string $id): ?Compra;

    public function findByIdWithRelations(string $id, array $relations = []): ?Compra;

    public function findByUsuari(string $usuariId): array;

    public function findByMerch(string $merchId): array;

    public function create(array $data): string;

    public function update(string $id, array $data): void;

    public function delete(string $id): void;
}
