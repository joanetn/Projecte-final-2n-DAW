<?php

namespace App\Modules\User\Infrastructure\Persistence\Eloquent\Repositories;

use App\Modules\User\Domain\Entities\UserRol;
use App\Modules\User\Domain\Repositories\UserRolRepositoryInterface;
use App\Modules\User\Infrastructure\Persistence\Eloquent\Models\UserRolModel;
use App\Modules\User\Infrastructure\Persistence\Mappers\UserRolMapper;

class EloquentUserRolRepository implements UserRolRepositoryInterface
{
    public function __construct(
        private UserRolModel $model,
        private UserRolMapper $mapper
    ) {}

    public function findById(string $id): ?UserRol
    {
        $model = $this->model->find($id);

        return $model ? $this->mapper->toDomain($model) : null;
    }

    public function findByUser(string $usuariId): array
    {
        $models = $this->model
            ->where('usuariId', $usuariId)
            ->orderBy('createdAt', 'desc')
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    public function findByUserId(string $usuariId): array
    {
        return $this->findByUser($usuariId);
    }

    public function findByUserIdAndRol(string $usuariId, string $rol): ?UserRol
    {
        $model = $this->model
            ->where('usuariId', $usuariId)
            ->where('rol', $rol)
            ->first();

        return $model ? $this->mapper->toDomain($model) : null;
    }

    public function findByRol(string $rol): array
    {
        $models = $this->model
            ->where('rol', $rol)
            ->orderBy('createdAt', 'desc')
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    public function create(array $data): UserRol
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
