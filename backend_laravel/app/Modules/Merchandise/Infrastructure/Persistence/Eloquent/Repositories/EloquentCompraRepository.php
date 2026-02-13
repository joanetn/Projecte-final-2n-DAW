<?php

namespace App\Modules\Merchandise\Infrastructure\Persistence\Eloquent\Repositories;

use App\Modules\Merchandise\Domain\Entities\Compra;
use App\Modules\Merchandise\Domain\Repositories\CompraRepositoryInterface;
use App\Modules\Merchandise\Infrastructure\Persistence\Eloquent\Models\CompraModel;
use App\Modules\Merchandise\Infrastructure\Persistence\Mappers\CompraMapper;

class EloquentCompraRepository implements CompraRepositoryInterface
{
    public function findAll(): array
    {
        return CompraModel::where('isActive', true)
            ->get()
            ->map(fn(CompraModel $model) => CompraMapper::toDomain($model))
            ->toArray();
    }

    public function findAllWithRelations(array $relations = []): array
    {
        return CompraModel::where('isActive', true)
            ->with($relations)
            ->get()
            ->map(fn(CompraModel $model) => CompraMapper::toDomain($model))
            ->toArray();
    }

    public function findById(string $id): ?Compra
    {
        $model = CompraModel::where('isActive', true)->find($id);

        return $model ? CompraMapper::toDomain($model) : null;
    }

    public function findByIdWithRelations(string $id, array $relations = []): ?Compra
    {
        $model = CompraModel::where('isActive', true)
            ->with($relations)
            ->find($id);

        return $model ? CompraMapper::toDomain($model) : null;
    }

    public function findByUsuari(string $usuariId): array
    {
        return CompraModel::where('isActive', true)
            ->where('usuariId', $usuariId)
            ->with(['usuari', 'merch'])
            ->get()
            ->map(fn(CompraModel $model) => CompraMapper::toDomain($model))
            ->toArray();
    }

    public function findByMerch(string $merchId): array
    {
        return CompraModel::where('isActive', true)
            ->where('merchId', $merchId)
            ->with(['usuari', 'merch'])
            ->get()
            ->map(fn(CompraModel $model) => CompraMapper::toDomain($model))
            ->toArray();
    }

    public function create(array $data): string
    {
        $model = CompraModel::create($data);

        return $model->id;
    }

    public function update(string $id, array $data): void
    {
        CompraModel::where('id', $id)->update($data);
    }

    public function delete(string $id): void
    {
        CompraModel::where('id', $id)->update(['isActive' => false]);
    }
}
