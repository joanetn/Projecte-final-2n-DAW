<?php

namespace App\Modules\Merchandise\Domain\Repositories;

use App\Modules\Merchandise\Domain\Entities\Merch;

interface MerchRepositoryInterface
{
    public function findAll(): array;

    public function findAllWithRelations(array $relations = []): array;

    public function findById(string $id): ?Merch;

    public function findByIdWithRelations(string $id, array $relations = []): ?Merch;

    public function create(array $data): string;

    public function update(string $id, array $data): void;

    public function delete(string $id): void;
}
