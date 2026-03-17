<?php

namespace App\Modules\Merchandise\Infrastructure\Persistence\Eloquent\Repositories;

use App\Modules\Merchandise\Domain\Entities\Merch;
use App\Modules\Merchandise\Domain\Repositories\MerchRepositoryInterface;
use App\Modules\Merchandise\Infrastructure\Persistence\Eloquent\Models\MerchModel;
use App\Modules\Merchandise\Infrastructure\Persistence\Mappers\MerchMapper;

class EloquentMerchRepository implements MerchRepositoryInterface
{
    public function __construct(
        private MerchModel $model,
        private MerchMapper $mapper
    ) {}

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

    public function findByIdWithLock(string $id): ?Merch
    {
        $model = MerchModel::where('isActive', true)
            ->where('id', $id)
            ->lock('for update nowait')
            ->first();

        return $model ? MerchMapper::toDomain($model) : null;
    }

    public function searchWithFilters(
        ?string $q,
        ?string $marca,
        ?string $minPrice,
        ?string $maxPrice,
        string $sort,
        int $page,
        int $limit
    ): array {
        $priceRange = [];

        if ($minPrice) {
            $priceRange['min'] = (float) $minPrice;
        }

        if ($maxPrice) {
            $priceRange['max'] = (float) $maxPrice;
        }

        $paginator = $this->model->query()
            ->where('isActive', true)
            ->search($q)
            ->byBrand($marca)
            ->byPriceRange($priceRange)
            ->sorted($sort)
            ->paginate($limit, ['*'], 'page', $page);

        return [
            'data' => collect($paginator->items())->map([$this->mapper, 'toDomain'])->toArray(),
            'current_page' => $paginator->currentPage(),
            'per_page' => $paginator->perPage(),
            'last_page'    => $paginator->lastPage(),
            'total'        => $paginator->total(),
        ];
    }

    public function findByIdIncludingInactive(string $id): ?Merch
    {
        $model = MerchModel::find($id);
        return $model ? MerchMapper::toDomain($model) : null;
    }

    public function findAllIncludingInactive(): array
    {
        return MerchModel::orderBy('created_at', 'desc')
            ->get()
            ->map(fn(MerchModel $model) => MerchMapper::toDomain($model))
            ->toArray();
    }
}
