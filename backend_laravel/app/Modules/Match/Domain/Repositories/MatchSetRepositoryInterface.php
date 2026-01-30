<?php

namespace Modules\Match\Domain\Repositories;

use Modules\Match\Domain\Entities\SetPartit;

interface SetPartitRepositoryInterface
{
    public function findById(string $id): ?SetPartit;

    public function findByPartit(string $partitId): array;

    public function create(array $data): SetPartit;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}