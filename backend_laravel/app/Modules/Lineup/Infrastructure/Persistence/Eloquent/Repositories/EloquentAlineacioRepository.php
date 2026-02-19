<?php

namespace App\Modules\Lineup\Infrastructure\Persistence\Eloquent\Repositories;

use App\Modules\Lineup\Infrastructure\Persistence\Eloquent\Models\AlineacioModel;
use App\Modules\Lineup\Infrastructure\Persistence\Mappers\AlineacioMapper;
use App\Modules\Lineup\Domain\Entities\Alineacio;
use App\Modules\Lineup\Domain\Repositories\AlineacioRepositoryInterface;

class EloquentAlineacioRepository implements AlineacioRepositoryInterface
{
    public function __construct(
        private AlineacioModel $model,
        private AlineacioMapper $mapper
    ) {}
    public function findById(string $id): ?Alineacio
    {
        $model = $this->model->where('isActive', true)->find($id);
        return $model ? $this->mapper->toDomain($model) : null;
    }
    public function findByIdWithRelations(string $id, array $relations): ?Alineacio
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
            ->with(['jugador', 'equip', 'partit'])
            ->orderBy('creada_at', 'desc')
            ->get();
        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }
    public function create(array $data): Alineacio
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
    public function findByPartit(string $partitId): array
    {
        $models = $this->model
            ->where('partitId', $partitId)
            ->where('isActive', true)
            ->with(['jugador', 'equip'])
            ->get();
        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }
    public function findByEquip(string $equipId): array
    {
        $models = $this->model
            ->where('equipId', $equipId)
            ->where('isActive', true)
            ->with(['jugador', 'partit'])
            ->get();
        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }
    public function findByJugador(string $jugadorId): array
    {
        $models = $this->model
            ->where('jugadorId', $jugadorId)
            ->where('isActive', true)
            ->with(['equip', 'partit'])
            ->get();
        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }
    public function findByPartitAndEquip(string $partitId, string $equipId): array
    {
        $models = $this->model
            ->where('partitId', $partitId)
            ->where('equipId', $equipId)
            ->where('isActive', true)
            ->with(['jugador'])
            ->get();
        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    public function findByIdIncludingInactive(string $id): ?Alineacio
    {
        $model = $this->model->find($id);
        return $model ? $this->mapper->toDomain($model) : null;
    }

    public function findAllIncludingInactive(): array
    {
        $models = $this->model
            ->with(['jugador', 'equip', 'partit'])
            ->orderBy('creada_at', 'desc')
            ->get();
        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }
}
