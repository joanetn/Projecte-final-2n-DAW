<?php

/**
 * Repositori Eloquent d'Instal·lacions.
 *
 * Implementació concreta del InstalacioRepositoryInterface usant Eloquent ORM.
 * Aquesta classe és la ÚNICA que coneix els detalls de persistència (SQL, Eloquent).
 * El domini i l'aplicació només coneixen la interfície, NO aquesta implementació
 * (Dependency Inversion Principle - SOLID).
 *
 * Utilitza el Mapper per convertir models Eloquent a entitats de domini.
 */

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
        // Buscar per ID i que estigui activa (soft delete manual)
        $model = $this->model->where('isActive', true)->find($id);

        return $model ? $this->mapper->toDomain($model) : null;
    }

    public function findByIdWithRelations(string $id, array $relations): ?Instalacio
    {
        // Buscar amb eager loading de relacions (evita N+1 queries)
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
        // Crear el model Eloquent i convertir-lo a entitat de domini
        $model = $this->model->create($data);

        return $this->mapper->toDomain($model);
    }

    public function update(string $id, array $data): bool
    {
        return $this->model->where('id', $id)->update($data);
    }

    public function delete(string $id): bool
    {
        // Soft delete: marca isActive = false en lloc d'eliminar físicament
        return $this->model->where('id', $id)->update(['isActive' => false]);
    }

    public function findByClubId(string $clubId): array
    {
        // Buscar totes les instal·lacions d'un club específic
        $models = $this->model
            ->where('clubId', $clubId)
            ->where('isActive', true)
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }
}
