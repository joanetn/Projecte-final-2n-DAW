<?php

namespace App\Modules\Merchandise\Infrastructure\Persistence\Eloquent\Repositories;

use App\Modules\Merchandise\Domain\Entities\Cart;
use App\Modules\Merchandise\Domain\Repositories\CartRepositoryInterface;
use App\Modules\Merchandise\Infrastructure\Persistence\Eloquent\Models\CartModel;
use App\Modules\Merchandise\Infrastructure\Persistence\Mappers\CartMapper;
use Illuminate\Support\Facades\Schema;

class EloquentCartRepository implements CartRepositoryInterface
{
    private const TABLE = 'carts';

    /** @var array<int, string>|null */
    private static ?array $columns = null;

    private function columns(): array
    {
        if (self::$columns === null) {
            self::$columns = Schema::getColumnListing(self::TABLE);
        }
        return self::$columns;
    }

    private function hasColumn(string $column): bool
    {
        static $flip = null;
        if ($flip === null) {
            $flip = array_flip($this->columns());
        }
        return isset($flip[$column]);
    }

    private function filterData(array $data): array
    {
        $allowed = array_flip($this->columns());
        return array_intersect_key($data, $allowed);
    }

    public function findAll(): array
    {
        $query = CartModel::query();
        if ($this->hasColumn('isActive')) {
            $query->where('isActive', true);
        }

        return $query
            ->get()
            ->map(fn(CartModel $model) => CartMapper::toDomain($model))
            ->toArray();
    }

    public function findAllWithRelations(array $relations = []): array
    {
        $query = CartModel::query();
        if ($this->hasColumn('isActive')) {
            $query->where('isActive', true);
        }

        return $query
            ->with($relations)
            ->get()
            ->map(fn(CartModel $model) => CartMapper::toDomain($model))
            ->toArray();
    }

    public function findById(string $id): ?Cart
    {
        $query = CartModel::query();
        if ($this->hasColumn('isActive')) {
            $query->where('isActive', true);
        }

        $model = $query->find($id);
        return $model ? CartMapper::toDomain($model) : null;
    }

    public function findByIdWithRelations(string $id, array $relations = []): ?Cart
    {
        $query = CartModel::query();
        if ($this->hasColumn('isActive')) {
            $query->where('isActive', true);
        }

        $model = $query->with($relations)->find($id);
        return $model ? CartMapper::toDomain($model) : null;
    }

    public function findActiveByUsuari(string $usuariId): ?Cart
    {
        $query = CartModel::where('usuariId', $usuariId);

        if ($this->hasColumn('isActive')) {
            $query->where('isActive', true);
        }

        if ($this->hasColumn('updated_at')) {
            $query->orderBy('updated_at', 'desc');
        } elseif ($this->hasColumn('created_at')) {
            $query->orderBy('created_at', 'desc');
        }

        $model = $query->first();
        return $model ? CartMapper::toDomain($model) : null;
    }

    public function findActiveByUsuariWithRelations(string $usuariId, array $relations = []): ?Cart
    {
        $query = CartModel::where('usuariId', $usuariId)->with($relations);

        if ($this->hasColumn('isActive')) {
            $query->where('isActive', true);
        }

        if ($this->hasColumn('updated_at')) {
            $query->orderBy('updated_at', 'desc');
        } elseif ($this->hasColumn('created_at')) {
            $query->orderBy('created_at', 'desc');
        }

        $model = $query->first();
        return $model ? CartMapper::toDomain($model) : null;
    }

    public function create(array $data): string
    {
        $model = CartModel::create($this->filterData($data));
        return $model->id;
    }

    public function update(string $id, array $data): void
    {
        CartModel::where('id', $id)->update($this->filterData($data));
    }

    public function delete(string $id): void
    {
        if ($this->hasColumn('isActive')) {
            CartModel::where('id', $id)->update(['isActive' => false]);
            return;
        }

        CartModel::where('id', $id)->delete();
    }
}
