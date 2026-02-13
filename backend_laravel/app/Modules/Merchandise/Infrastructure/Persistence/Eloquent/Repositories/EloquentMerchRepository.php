<?php

namespace App\Modules\Merchandise\Infrastructure\Persistence\Eloquent\Repositories;

use App\Modules\Merchandise\Domain\Entities\Merch;
use App\Modules\Merchandise\Domain\Repositories\MerchRepositoryInterface;
use App\Modules\Merchandise\Infrastructure\Persistence\Eloquent\Models\MerchModel;
use App\Modules\Merchandise\Infrastructure\Persistence\Mappers\MerchMapper;

class EloquentMerchRepository implements MerchRepositoryInterface
{
    public function findAll(): array
    {
        return MerchModel::where('isActive', true)
            ->get()
            ->map(fn(MerchModel $model) => MerchMapper::toDomain($model))
            ->toArray();
    }

    public function findAllWithRelations(array $relations = []): array
    {
        return MerchModel::where('isActive', true)
            ->with($relations)
            ->get()
            ->map(fn(MerchModel $model) => MerchMapper::toDomain($model))
            ->toArray();
    }

    public function findById(string $id): ?Merch
    {
        $model = MerchModel::where('isActive', true)->find($id);

        return $model ? MerchMapper::toDomain($model) : null;
    }

    public function findByIdWithRelations(string $id, array $relations = []): ?Merch
    {
        $model = MerchModel::where('isActive', true)
            ->with($relations)
            ->find($id);

        return $model ? MerchMapper::toDomain($model) : null;
    }

    public function create(array $data): string
    {
        $model = MerchModel::create($data);

        return $model->id;
    }

    public function update(string $id, array $data): void
    {
        MerchModel::where('id', $id)->update($data);
    }

    public function delete(string $id): void
    {
        MerchModel::where('id', $id)->update(['isActive' => false]);
    }
}
