<?php

namespace App\Modules\User\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UserModel extends Model
{
    use HasUuids;

    protected $table = 'usuaris';

    protected $fillable = [
        'id',
        'nom',
        'email',
        'contrasenya',
        'telefon',
        'dataNaixement',
        'nivell',
        'avatar',
        'dni',
        'isActive',
    ];

    protected $casts = [
        'dataNaixement' => 'datetime',
        'isActive' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $hidden = [
        'contrasenya',
    ];

    public function rols(): HasMany
    {
        return $this->hasMany(\App\Models\UsuariRol::class, 'usuariId');
    }

    public function equipUsuaris(): HasMany
    {
        return $this->hasMany(\App\Models\EquipUsuari::class, 'usuariId');
    }

    public function compras(): HasMany
    {
        return $this->hasMany(\App\Models\Compra::class, 'usuariId');
    }

    public function seguros(): HasMany
    {
        return $this->hasMany(\App\Models\Seguro::class, 'usuariId');
    }

    public function notificacions(): HasMany
    {
        return $this->hasMany(\App\Models\Notificacio::class, 'usuariId');
    }

    public function scopeSearch(Builder $query, ?string $q): Builder
    {
        return $query->when(
            $q,
            fn(Builder $qb) =>
            $qb->where(function (Builder $w) use ($q) {
                $w->where('nom', 'LIKE', "%{$q}%")
                    ->orWhere('email', 'LIKE', "%{$q}%");
            })
        );
    }

    public function scopeByNivell(Builder $query, ?string $nivell): Builder
    {
        return $query->when($nivell, fn(Builder $qb) => $qb->where('nivell', $nivell));
    }

    public function scopeSorted(Builder $query, string $sort = 'created_at_desc'): Builder
    {
        return match ($sort) {
            'nom_asc'        => $query->orderBy('nom', 'asc'),
            'nom_desc'       => $query->orderBy('nom', 'desc'),
            'created_at_asc' => $query->orderBy('created_at', 'asc'),
            default          => $query->orderBy('created_at', 'desc'),
        };
    }
}
