<?php

namespace App\Modules\Club\Infrastructure\Persistence\Eloquent\Repositories;

use App\Modules\Club\Domain\Entities\EquipUsuari;
use App\Modules\Club\Domain\Repositories\EquipUsuariRepositoryInterface;
use App\Modules\Club\Infrastructure\Persistence\Eloquent\Models\EquipUsuariModel;
use App\Modules\Club\Infrastructure\Persistence\Mappers\EquipUsuariMapper;

class EloquentEquipUsuariRepository implements EquipUsuariRepositoryInterface
{
    public function __construct(
        private EquipUsuariModel $model,
        private EquipUsuariMapper $mapper
    ) {}

    public function findById(string $id): ?EquipUsuari
    {
        $model = $this->model->find($id);

        return $model ? $this->mapper->toDomain($model) : null;
    }

    public function findByEquipId(string $equipId): array
    {
        $models = $this->model
            ->where('equipId', $equipId)
            ->where('isActive', true)
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    public function findByUsuariId(string $usuariId): array
    {
        $models = $this->model
            ->where('usuariId', $usuariId)
            ->where('isActive', true)
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    public function findByEquipIdAndUsuariId(string $equipId, string $usuariId): ?EquipUsuari
    {
        $model = $this->model
            ->where('equipId', $equipId)
            ->where('usuariId', $usuariId)
            ->first();

        return $model ? $this->mapper->toDomain($model) : null;
    }

    public function create(array $data): EquipUsuari
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

    public function findByRolEquip(string $equipId, string $rolEquip): array
    {
        $models = $this->model
            ->where('equipId', $equipId)
            ->where('rolEquip', $rolEquip)
            ->where('isActive', true)
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    public function findByIdIncludingInactive(string $id): ?EquipUsuari
    {
        $model = $this->model->find($id);
        return $model ? $this->mapper->toDomain($model) : null;
    }

    public function findAllIncludingInactive(): array
    {
        $models = $this->model->orderBy('created_at', 'desc')->get();
        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }
}
