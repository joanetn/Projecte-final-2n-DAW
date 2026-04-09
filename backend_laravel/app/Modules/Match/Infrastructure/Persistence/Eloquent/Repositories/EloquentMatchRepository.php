<?php

namespace App\Modules\Match\Infrastructure\Persistence\Eloquent\Repositories;

use App\Modules\Match\Infrastructure\Persistence\Eloquent\Models\MatchModel;
use App\Modules\Match\Infrastructure\Persistence\Mappers\MatchMapper;
use App\Modules\Match\Domain\Entities\Matches;
use App\Modules\Match\Domain\Repositories\MatchRepositoryInterface;

class EloquentMatchRepository implements MatchRepositoryInterface
{
    public function __construct(
        private MatchModel $model,
        private MatchMapper $mapper
    ) {}

    public function findById(string $id): ?Matches
    {
        $model = $this->model->where('isActive', true)->find($id);

        return $model ? $this->mapper->toDomain($model) : null;
    }

    public function findByIdWithRelations(string $id, array $relations): ?Matches
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
            ->orderBy('dataHora', 'desc')
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    public function create(array $data): Matches
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
            ->where(function ($query) use ($equipId) {
                $query->where('localId', $equipId)
                    ->orWhere('visitantId', $equipId);
            })
            ->where('isActive', true)
            ->with(['local', 'visitant', 'jornada', 'pista', 'arbitre'])
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    public function findByArbitre(string $arbitreId): array
    {
        $models = $this->model
            ->where('arbitreId', $arbitreId)
            ->where('isActive', true)
            ->with(['local', 'visitant', 'jornada', 'pista', 'arbitre'])
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    public function findFiltered(?string $arbitreId = null, ?string $equipId = null, array $equipIds = [], ?string $status = null): array
    {
        $query = $this->model
            ->where('isActive', true)
            ->with(['local', 'visitant', 'jornada', 'pista', 'arbitre'])
            ->orderBy('dataHora', 'desc');

        if (!empty($arbitreId)) {
            $query->where('arbitreId', $arbitreId);
        }

        if (!empty($equipId)) {
            $query->where(function ($builder) use ($equipId) {
                $builder
                    ->where('localId', $equipId)
                    ->orWhere('visitantId', $equipId);
            });
        }

        if (!empty($equipIds)) {
            $query->where(function ($builder) use ($equipIds) {
                $builder
                    ->whereIn('localId', $equipIds)
                    ->orWhereIn('visitantId', $equipIds);
            });
        }

        if (!empty($status)) {
            $query->where('status', strtoupper($status));
        }

        $models = $query->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    public function findByJornada(string $jornadaId): array
    {
        $models = $this->model
            ->where('jornadaId', $jornadaId)
            ->where('isActive', true)
            ->with(['local', 'visitant', 'jornada', 'pista', 'arbitre'])
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    public function findByIdIncludingInactive(string $id): ?Matches
    {
        $model = $this->model->find($id);
        return $model ? $this->mapper->toDomain($model) : null;
    }

    public function findAllIncludingInactive(): array
    {
        $models = $this->model
            ->orderBy('dataHora', 'desc')
            ->get();
        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    public function findByIdIncludingInactiveWithRelations(string $id, array $relations): ?Matches
    {
        $model = $this->model
            ->with($relations)
            ->find($id);
        return $model ? $this->mapper->toDomain($model) : null;
    }
}
