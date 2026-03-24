<?php

namespace App\Modules\Invitation\Infrastructure\Persistence\Eloquent\Repositories;

use App\Modules\Invitation\Domain\Entities\InvitacioEquip;
use App\Modules\Invitation\Domain\Repositories\InvitacioEquipRepositoryInterface;
use App\Modules\Invitation\Infrastructure\Persistence\Eloquent\Models\InvitacioEquipModel;
use App\Modules\Invitation\Infrastructure\Persistence\Mappers\InvitacioEquipMapper;

class EloquentInvitacioEquipRepository implements InvitacioEquipRepositoryInterface
{
    public function __construct(
        private InvitacioEquipModel $model,
        private InvitacioEquipMapper $mapper
    ) {}

    public function findById(string $id): ?InvitacioEquip
    {
        $model = $this->model->where('isActive', true)->find($id);

        return $model ? $this->mapper->toDomain($model) : null;
    }

    public function findByIdWithRelations(string $id, array $relations): ?InvitacioEquip
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

    public function create(array $data): InvitacioEquip
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
            ->with(['equip', 'usuari'])
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    public function findByUsuari(string $usuariId): array
    {
        $models = $this->model
            ->where('usuariId', $usuariId)
            ->where('isActive', true)
            ->with(['equip', 'usuari'])
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    public function findByEstat(string $estat): array
    {
        $models = $this->model
            ->where('estat', $estat)
            ->where('isActive', true)
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    public function findPendentsByUsuari(string $usuariId): array
    {
        $models = $this->model
            ->where('usuariId', $usuariId)
            ->where('estat', 'pendent')
            ->where('isActive', true)
            ->with(['equip', 'usuari'])
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }
}
