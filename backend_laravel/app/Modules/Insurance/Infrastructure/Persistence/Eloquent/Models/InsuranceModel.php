<?php

namespace App\Modules\Insurance\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InsuranceModel extends Model
{
    use HasUuids;

    protected $table = "seguros";

    protected $fillable = [
        'id',
        'usuariId',
        'dataExpiracio',
        'pagat',
        'stripe_payment_intent_id',
        'preu',
        'mesos',
        'isActive'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'isActive' => 'boolean',
        'pagat' => 'boolean',
        'dataExpiracio' => 'datetime',
        'preu' => 'float',
        'mesos' => 'integer'
    ];

    public function usuari(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Usuari::class, 'usuariId');
    }

    public function scopeSearch(Builder $query, ?string $q): Builder
    {
        return $query->when(
            $q,
            fn(Builder $qb) =>
            $qb->where(function (Builder $w) use ($q) {
                $w->whereHas(
                    'usuari',
                    fn(Builder $u) =>
                    $u->where('nom', 'ILIKE', "%{$q}%")
                        ->orWhere('email', 'ILIKE', "%{$q}%")
                );
            })
        );
    }

    public function scopeByPaid(Builder $query, ?bool $pagat)
    {
        return $query->when($pagat, fn(Builder $qb) => $qb->where('pagat', $pagat));
    }

    public function scopeByPriceRange(Builder $query, ?array $priceRange)
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
            'exp_asc' => $query->orderBy('dataExpiracio', 'asc'),
            'exp_desc' => $query->orderBy('dataExpiracio', 'desc'),
            default => $query->orderBy('id')
        };
    }
}
