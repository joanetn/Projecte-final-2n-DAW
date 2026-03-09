<?php

namespace App\Modules\Insurance\Domain\Repositories;

use App\Modules\Insurance\Domain\Entities\Insurance;

interface InsuranceRepositoryInterface
{
    public function findAll(): array;

    public function findAllWithRelations(array $relations = []): array;

    public function findById(string $id): ?Insurance;

    public function findAllByUserId(string $userId): array;

    public function findByIdWithRelations(string $id, array $relations = []): ?Insurance;

    public function create(array $data): Insurance;

    public function update(string $id, array $data): void;

    public function delete(string $id): void;

    public function findByIdIncludingInactive(string $id): ?Insurance;

    public function findAllIncludingInactive(): array;

    public function findAllIncludingInactiveWithRelations(array $relations): array;

    public function findByIdIncludingInactiveWithRelations(string $id, array $relations): ?Insurance;

    public function searchWithFilters(
        ?string $q,
        string $sort,
        ?string $minPrice,
        ?string $maxPrice,
        ?bool $pagat,
        int $page,
        int $limit
    ): array;

    public function findByStripePaymentIntentId(string $paymentIntentId): ?Insurance;
}
