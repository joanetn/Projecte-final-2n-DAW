<?php

namespace App\Modules\Merchandise\Infrastructure\Persistence\Eloquent\Models;

use App\Enums\MerchBrand;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class MerchModel extends Model
{
    use HasUuids;

    protected $table = 'merchs';

    protected $fillable = [
        'id',
        'nom',
        'marca',
        'preu',
        'stock',
        'isActive',
    ];

    protected $casts = [
        'preu' => 'float',
        'stock' => 'integer',
        'isActive' => 'boolean',
        'marca' => MerchBrand::class,
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function compras(): HasMany
    {
        return $this->hasMany(CompraModel::class, 'merchId');
    }

    public function scopeSearch(Builder $query, ?string $q): Builder
    {
        return $query->when(
            $q,
            fn(Builder $qb) =>
            $qb->where(function (Builder $w) use ($q) {
                $w->where('nom', 'LIKE', "%{$q}%");
            })
        );
    }

    public function scopeByBrand(Builder $query, ?string $marca)
    {
        return $query->when($marca, fn(Builder $qb) => $qb->where('marca', $marca));
    }

    public function scopeByPriceRange($query, ?array $priceRange)
    {
        return $query->when($priceRange, function ($qb) use ($priceRange) {
            $min = $priceRange['min'] ?? null;
            $max = $priceRange['max'] ?? null;

            if ($min) {
                $qb->where('preu', '>=', $min);
            }
            if ($max) {
                $qb->where('preu', '<=', $max);
            }
        });
    }

    public function scopeSorted(Builder $query, string $sort = 'id')
    {
        return match ($sort) {
            'preu_asc' => $query->orderBy('preu', 'asc'),
            'preu_desc' => $query->orderBy('preu', 'desc'),
            default => $query->orderBy('id')
        };
    }
}
