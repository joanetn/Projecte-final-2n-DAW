<?php

namespace App\Modules\Match\Domain\Repositories;

use App\Modules\Match\Domain\Entities\MatchSet;

interface MatchSetRepositoryInterface
{
    public function findById(string $id): ?MatchSet;

    public function findByPartit(string $partitId): array;

    public function create(array $data): MatchSet;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
