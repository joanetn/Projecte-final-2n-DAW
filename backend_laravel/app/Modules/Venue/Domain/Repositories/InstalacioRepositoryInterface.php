<?php

namespace App\Modules\Venue\Domain\Repositories;

use App\Modules\Venue\Domain\Entities\Instalacio;

interface InstalacioRepositoryInterface
{
    public function findById(string $id): ?Instalacio;

    public function findByIdWithRelations(string $id, array $relations): ?Instalacio;

    public function findAll(): array;

    public function findAllWithRelations(array $relations): array;

    public function create(array $data): Instalacio;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;

    public function findByClubId(string $clubId): array;
    public function findByIdIncludingInactive(string $id): ?Instalacio;
    public function findAllIncludingInactive(): array;
    public function findByIdIncludingInactiveWithRelations(string $id, array $relations): ?Instalacio;
}
