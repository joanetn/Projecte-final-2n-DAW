<?php

namespace App\Modules\Venue\Domain\Repositories;

use App\Modules\Venue\Domain\Entities\Pista;

interface PistaRepositoryInterface
{
    public function findById(string $id): ?Pista;

    public function findAll(): array;

    public function findByInstalacioId(string $instalacioId): array;

    public function create(array $data): Pista;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
