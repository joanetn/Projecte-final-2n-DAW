<?php

namespace App\Modules\User\Infrastructure\Persistence\Eloquent\Repositories;

use App\Modules\User\Domain\Entities\User;
use App\Modules\User\Domain\Repositories\UserRepositoryInterface;
use App\Modules\User\Infrastructure\Persistence\Eloquent\Models\UserModel;
use App\Modules\User\Infrastructure\Persistence\Mappers\UserMapper;

class EloquentUserRepository implements UserRepositoryInterface
{
    public function __construct(
        private UserModel $model,
        private UserMapper $mapper
    ) {}

    public function findById(string $id): ?User
    {
        $model = $this->model->where('isActive', true)->find($id);

        return $model ? $this->mapper->toDomain($model) : null;
    }

    public function findByIdWithRelations(string $id, array $relations): ?User
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

    public function findAllIncludingInactive(): array
    {
        $models = $this->model
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    public function findAllIncludingInactiveWithRelations(array $relations): array
    {
        $models = $this->model
            ->with($relations)
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    public function findByIdIncludingInactive(string $id): ?User
    {
        $model = $this->model->find($id);

        return $model ? $this->mapper->toDomain($model) : null;
    }

    public function findByIdIncludingInactiveWithRelations(string $id, array $relations): ?User
    {
        $model = $this->model
            ->with($relations)
            ->find($id);

        return $model ? $this->mapper->toDomain($model) : null;
    }

    public function create(array $data): User
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

    public function findByEmail(string $email): array
    {
        $models = $this->model
            ->where('email', $email)
            ->where('isActive', true)
            ->with(['rols', 'equipUsuaris', 'compras', 'seguros'])
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    public function findByLevel(string $level): array
    {
        $models = $this->model
            ->where('nivell', $level)
            ->where('isActive', true)
            ->with(['rols', 'equipUsuaris', 'compras', 'seguros'])
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }
}
