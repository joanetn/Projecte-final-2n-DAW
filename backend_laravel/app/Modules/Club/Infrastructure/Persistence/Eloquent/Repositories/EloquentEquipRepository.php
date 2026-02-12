<?php

namespace App\Modules\Club\Infrastructure\Persistence\Eloquent\Repositories;

use App\Modules\Club\Domain\Entities\Equip;
use App\Modules\Club\Domain\Repositories\EquipRepositoryInterface;
use App\Modules\Club\Infrastructure\Persistence\Eloquent\Models\EquipModel;
use App\Modules\Club\Infrastructure\Persistence\Mappers\EquipMapper;

class EloquentEquipRepository implements EquipRepositoryInterface
{
    public function __construct(
        private EquipModel $model,
        private EquipMapper $mapper
    ) {}

    public function findById(string $id): ?Equip
    {
        $model = $this->model->where('isActive', true)->find($id);

        return $model ? $this->mapper->toDomain($model) : null;
    }

    public function findByIdWithRelations(string $id, array $relations): ?Equip
    {
        $model = $this->model
            ->where('isActive', true)
            ->with($relations)
            ->find($id);

        return $model ? $this->mapper->toDomain($model) : null;
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

    public function findAll(): array
    {
        $models = $this->model
            ->where('isActive', true)
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    public function create(array $data): Equip
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

    public function findByCategoria(string $categoria): array
    {
        $models = $this->model
            ->where('categoria', $categoria)
            ->where('isActive', true)
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }
}
