<?php

namespace App\Modules\Club\Infrastructure\Persistence\Eloquent\Repositories;

use App\Modules\Club\Domain\Entities\Club;
use App\Modules\Club\Domain\Repositories\ClubRepositoryInterface;
use App\Modules\Club\Infrastructure\Persistence\Eloquent\Models\ClubModel;
use App\Modules\Club\Infrastructure\Persistence\Mappers\ClubMapper;

class EloquentClubRepository implements ClubRepositoryInterface
{
    public function __construct(
        private ClubModel $model,
        private ClubMapper $mapper
    ) {}

    public function findById(string $id): ?Club
    {
        $model = $this->model->where('isActive', true)->find($id);

        return $model ? $this->mapper->toDomain($model) : null;
    }

    public function findByIdWithRelations(string $id, array $relations): ?Club
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
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    public function findAllWithRelations(array $relations): array
    {
        $models = $this->model
            ->where('isActive', true)
            ->with($relations)
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    public function create(array $data): Club
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

    public function findByProvincia(string $provincia): array
    {
        $models = $this->model
            ->where('provincia', $provincia)
            ->where('isActive', true)
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    public function findByIdIncludingInactive(string $id): ?Club
    {
        $model = $this->model->find($id);
        return $model ? $this->mapper->toDomain($model) : null;
    }

    public function findAllIncludingInactive(): array
    {
        $models = $this->model->orderBy('created_at', 'desc')->get();
        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    public function findByIdIncludingInactiveWithRelations(string $id, array $relations): ?Club
    {
        $model = $this->model->with($relations)->find($id);
        return $model ? $this->mapper->toDomain($model) : null;
    }
}
