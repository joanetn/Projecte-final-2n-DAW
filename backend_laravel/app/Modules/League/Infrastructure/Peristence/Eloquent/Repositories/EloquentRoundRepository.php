<?php

namespace App\Modules\League\Infrastructure\Peristence\Eloquent\Repositories;

use App\Modules\League\Domain\Entities\Round;
use App\Modules\League\Domain\Repositories\RoundRepositoryInterface;
use App\Modules\League\Infrastructure\Peristence\Eloquent\Models\RoundModel;
use App\Modules\League\Infrastructure\Peristence\Mappers\RoundMapper;

class EloquentRoundRepository implements RoundRepositoryInterface
{
    public function __construct(
        private RoundModel $model,
        private RoundMapper $mapper
    ) {}

    public function findById(string $id): ?Round
    {
        $model = $this->model->where('isActive', true)->find($id);

        return $model ? $this->mapper->toDomain($model) : null;
    }

    public function findByIdWithRelations(string $id, array $relations): ?Round
    {
        $model = $this->model
            ->where('isActive', true)
            ->with($relations)
            ->find($id);

        return $model ? $this->mapper->toDomain($model) : null;
    }

    public function findAll(): array
    {
        $models = $this->model
            ->where('isActive', true)
            ->orderBy('dataInici', 'asc')
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    public function create(array $data): Round
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
        return $this->model->where('id', $id)->update(['isActive' => false]);
    }

    public function findByLeague(string $lligaId): array
    {
        $models = $this->model
            ->where('lligaId', $lligaId)
            ->where('isActive', true)
            ->with(['partits'])
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    public function findByStatus(string $status): array
    {
        $models = $this->model
            ->where('status', $status)
            ->where('isActive', true)
            ->with(['partits'])
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }
}
