<?php

namespace App\Modules\Venue\Infrastructure\Persistence\Eloquent\Repositories;

use App\Modules\Venue\Domain\Entities\Instalacio;
use App\Modules\Venue\Domain\Repositories\InstalacioRepositoryInterface;
use App\Modules\Venue\Infrastructure\Persistence\Eloquent\Models\InstalacioModel;
use App\Modules\Venue\Infrastructure\Persistence\Mappers\InstalacioMapper;

class EloquentInstalacioRepository implements InstalacioRepositoryInterface
{
    public function __construct(
        private InstalacioModel $model,
        private InstalacioMapper $mapper
    ) {}

    public function findById(string $id): ?Instalacio
    {
        $model = $this->model->where('isActive', true)->find($id);

        return $model ? $this->mapper->toDomain($model) : null;
    }

    public function findByIdWithRelations(string $id, array $relations): ?Instalacio
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

    public function create(array $data): Instalacio
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

    public function findByClubId(string $clubId): array
    {
        $models = $this->model
            ->where('clubId', $clubId)
            ->where('isActive', true)
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    public function findByIdIncludingInactive(string $id): ?Instalacio
    {
        $model = $this->model->find($id);
        return $model ? $this->mapper->toDomain($model) : null;
    }

    public function findAllIncludingInactive(): array
    {
        $models = $this->model
            ->orderBy('created_at', 'desc')
            ->get();
        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    public function findByIdIncludingInactiveWithRelations(string $id, array $relations): ?Instalacio
    {
        $model = $this->model
            ->with($relations)
            ->find($id);
        return $model ? $this->mapper->toDomain($model) : null;
    }
}
