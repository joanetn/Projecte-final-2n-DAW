<?php

namespace App\Modules\League\Infrastructure\Peristence\Eloquent\Repositories;

use App\Modules\League\Domain\Entities\Standing;
use App\Modules\League\Domain\Repositories\StandingRepositoryInterface;
use App\Modules\League\Infrastructure\Peristence\Eloquent\Models\StandingModel;
use App\Modules\League\Infrastructure\Peristence\Mappers\StandingMapper;

class EloquentStandingRepository implements StandingRepositoryInterface
{
    public function __construct(
        private StandingModel $model,
        private StandingMapper $mapper
    ) {}

    public function findById(string $id): ?Standing
    {
        $model = $this->model->where('isActive', true)->find($id);

        return $model ? $this->mapper->toDomain($model) : null;
    }

    public function findAll(): array
    {
        $models = $this->model
            ->where('isActive', true)
            ->orderBy('punts', 'desc')
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    public function findByIdWithRelations(string $id, array $relations): ?Standing
    {
        $model = $this->model
            ->where('isActive', true)
            ->with($relations)
            ->find($id);

        return $model ? $this->mapper->toDomain($model) : null;
    }

    public function create(array $data): Standing
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

    public function findByEquip(string $equipId): array
    {
        $models = $this->model
            ->where('equipId', $equipId)
            ->where('isActive', true)
            ->with(['lliga', 'equip'])
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    public function findByLeague(string $lligaId): array
    {
        $models = $this->model
            ->where('lligaId', $lligaId)
            ->where('isActive', true)
            ->with(['lliga', 'equip'])
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }
}
