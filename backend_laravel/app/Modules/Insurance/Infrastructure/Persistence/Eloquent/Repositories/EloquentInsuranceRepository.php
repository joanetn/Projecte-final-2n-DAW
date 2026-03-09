<?php

namespace App\Modules\Insurance\Infrastructure\Persistence\Eloquent\Repositories;

use App\Modules\Insurance\Domain\Entities\Insurance;
use App\Modules\Insurance\Domain\Repositories\InsuranceRepositoryInterface;
use App\Modules\Insurance\Infrastructure\Persistence\Eloquent\Models\InsuranceModel;
use App\Modules\Insurance\Infrastructure\Persistence\Mappers\InsuranceMapper;

class EloquentInsuranceRepository implements InsuranceRepositoryInterface
{
    public function __construct(
        private InsuranceModel $model,
        private InsuranceMapper $mapper
    ) {}

    public function findAll(): array
    {
        $models = $this->model
            ->where('isActive', true)
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    public function findById(string $id): ?Insurance
    {
        $model = $this->model->where('isActive', true)->find($id);

        return $model ? $this->mapper->toDomain($model) : null;
    }

    public function findByIdWithRelations(string $id, array $relations = []): ?Insurance
    {
        $model = $this->model
            ->where('isActive', true)
            ->with($relations)
            ->find($id);

        return $model ? $this->mapper->toDomain($model) : null;
    }

    public function findAllWithRelations(array $relations = []): array
    {
        $models = $this->model
            ->where('isActive', true)
            ->with($relations)
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    public function findAllIncludingInactive(): array
    {
        $models = $this->model
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    public function findAllIncludingInactiveWithRelations(array $relations): array
    {
        $models = $this->model
            ->with($relations)
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    public function findByIdIncludingInactive(string $id): ?Insurance
    {
        $model = $this->model->find($id);

        return $model ? $this->mapper->toDomain($model) : null;
    }

    public function findByIdIncludingInactiveWithRelations(string $id, array $relations): ?Insurance
    {
        $model = $this->model
            ->with($relations)
            ->find($id);

        return $model ? $this->mapper->toDomain($model) : null;
    }

    public function create(array $data): Insurance
    {
        $model = $this->model->create($data);

        return $this->mapper->toDomain($model);
    }

    public function update(string $id, array $data): void
    {
        $this->model->where('id', $id)->update($data);
    }

    public function delete(string $id): void
    {
        $this->model->where('id', $id)->update(['isActive' => false]);
    }

    public function searchWithFilters(?string $q, string $sort, ?string $minPrice, ?string $maxPrice, ?bool $pagat, int $page, int $limit): array
    {
        $priceRange = [];

        if ($minPrice) {
            $priceRange['min'] = (float) $minPrice;
        }

        if ($maxPrice) {
            $priceRange['max'] = (float) $maxPrice;
        }

        $paginator = $this->model->query()
            ->with(['usuari'])
            ->search($q)
            ->byPaid($pagat)
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
}
