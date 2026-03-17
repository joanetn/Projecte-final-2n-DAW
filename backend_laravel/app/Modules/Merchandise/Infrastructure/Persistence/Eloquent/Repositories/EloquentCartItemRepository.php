<?php

namespace App\Modules\Merchandise\Infrastructure\Persistence\Eloquent\Repositories;

use App\Modules\Merchandise\Domain\Entities\CartItem;
use App\Modules\Merchandise\Domain\Repositories\CartItemRepositoryInterface;
use App\Modules\Merchandise\Infrastructure\Persistence\Eloquent\Models\CartItemModel;
use App\Modules\Merchandise\Infrastructure\Persistence\Mappers\CartItemMapper;
use Illuminate\Support\Facades\Schema;

class EloquentCartItemRepository implements CartItemRepositoryInterface
{
    private const TABLE = 'cart_items';

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

    public function findById(string $id): ?CartItem
    {
        $query = CartItemModel::query();
        if ($this->hasColumn('isActive')) {
            $query->where('isActive', true);
        }

        $model = $query->find($id);
        return $model ? CartItemMapper::toDomain($model) : null;
    }

    public function findByIdWithRelations(string $id, array $relations = []): ?CartItem
    {
        $query = CartItemModel::query();
        if ($this->hasColumn('isActive')) {
            $query->where('isActive', true);
        }

        $model = $query->with($relations)->find($id);
        return $model ? CartItemMapper::toDomain($model) : null;
    }

    public function findByCartAndMerch(string $cartId, string $merchId): ?CartItem
    {
        $query = CartItemModel::where('cartId', $cartId)->where('merchId', $merchId);
        if ($this->hasColumn('isActive')) {
            $query->where('isActive', true);
        }

        $model = $query->first();
        return $model ? CartItemMapper::toDomain($model) : null;
    }

    public function findByCartAndMerchWithRelations(string $cartId, string $merchId, array $relations = []): ?CartItem
    {
        $query = CartItemModel::where('cartId', $cartId)->where('merchId', $merchId)->with($relations);
        if ($this->hasColumn('isActive')) {
            $query->where('isActive', true);
        }

        $model = $query->first();
        return $model ? CartItemMapper::toDomain($model) : null;
    }

    public function findByCart(string $cartId): array
    {
        $query = CartItemModel::where('cartId', $cartId);
        if ($this->hasColumn('isActive')) {
            $query->where('isActive', true);
        }

        return $query
            ->get()
            ->map(fn(CartItemModel $model) => CartItemMapper::toDomain($model))
            ->toArray();
    }

    public function findByCartWithRelations(string $cartId, array $relations = []): array
    {
        $query = CartItemModel::where('cartId', $cartId)->with($relations);
        if ($this->hasColumn('isActive')) {
            $query->where('isActive', true);
        }

        return $query
            ->get()
            ->map(fn(CartItemModel $model) => CartItemMapper::toDomain($model))
            ->toArray();
    }

    public function create(array $data): string
    {
        $model = CartItemModel::create($this->filterData($data));
        return $model->id;
    }

    public function update(string $id, array $data): void
    {
        CartItemModel::where('id', $id)->update($this->filterData($data));
    }

    public function delete(string $id): void
    {
        if ($this->hasColumn('isActive')) {
            CartItemModel::where('id', $id)->update(['isActive' => false]);
            return;
        }

        CartItemModel::where('id', $id)->delete();
    }

    public function deleteByCart(string $cartId): void
    {
        if ($this->hasColumn('isActive')) {
            CartItemModel::where('cartId', $cartId)->update(['isActive' => false]);
            return;
        }

        CartItemModel::where('cartId', $cartId)->delete();
    }
}
