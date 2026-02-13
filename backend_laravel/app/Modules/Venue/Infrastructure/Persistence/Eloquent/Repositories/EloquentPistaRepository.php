<?php

namespace App\Modules\Venue\Infrastructure\Persistence\Eloquent\Repositories;

use App\Modules\Venue\Domain\Entities\Pista;
use App\Modules\Venue\Domain\Repositories\PistaRepositoryInterface;
use App\Modules\Venue\Infrastructure\Persistence\Eloquent\Models\PistaModel;
use App\Modules\Venue\Infrastructure\Persistence\Mappers\PistaMapper;

class EloquentPistaRepository implements PistaRepositoryInterface
{
    public function __construct(
        private PistaModel $model,
        private PistaMapper $mapper
    ) {}

    public function findById(string $id): ?Pista
    {
        $model = $this->model->where('isActive', true)->find($id);

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

    public function findByInstalacioId(string $instalacioId): array
    {
        // Buscar totes les pistes d'una instal·lació específica
        $models = $this->model
            ->where('instalacioId', $instalacioId)
            ->where('isActive', true)
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    public function create(array $data): Pista
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
}
