<?php

namespace App\Modules\Match\Infrastructure\Persistence\Eloquent\Repositories;

use App\Modules\Match\Infrastructure\Persistence\Mappers\SetMatchMapper;
use App\Modules\Match\Domain\Entities\MatchSet;
use App\Modules\Match\Domain\Repositories\MatchSetRepositoryInterface;
use App\Modules\Match\Infrastructure\Persistence\Eloquent\Models\SetMatchModel;

class EloquentSetMatchRepository implements MatchSetRepositoryInterface
{
    public function __construct(
        private SetMatchModel $model,
        private SetMatchMapper $mapper
    ) {}

    public function findById(string $id): ?MatchSet
    {
        $model = $this->model->find($id);

        return $model ? $this->mapper->toDomain($model) : null;
    }

    public function findByPartit(string $partitId): array
    {
        $models = $this->model
            ->where('partitId', $partitId)
            ->orderBy('numeroSet')
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    public function create(array $data): MatchSet
    {
        $model = $this->model->create($data);

        return $this->mapper->toDomain($model);
    }

    public function update(string $id, array $data): bool
    {
        return $this->model->where('id', $id)->update($data);
    }

    public function delete(string $id): bool
    {
        return $this->model->where('id', $id)->delete();
    }
}
