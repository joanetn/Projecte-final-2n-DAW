<?php

namespace App\Modules\User\Infrastructure\Persistence\Eloquent\Models;

use App\Enums\UserLevel;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;
// Extender de Authenticatable en vez de Model para que tymon/jwt pueda usarlo
use Illuminate\Foundation\Auth\User as Authenticatable;
// Interfaz requerida por tymon/jwt-auth para saber cómo identificar al usuario
use Tymon\JWTAuth\Contracts\JWTSubject;

class UserModel extends Authenticatable implements JWTSubject
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
        'session_version', // Contador para invalidar todas las sesiones del usuario
    ];

    protected $casts = [
        'dataNaixement' => 'datetime',
        'isActive' => 'boolean',
        'session_version' => 'integer',
        'nivell' => UserLevel::class,
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

    // ==========================================
    // Métodos requeridos por JWTSubject (tymon)
    // ==========================================

    // Devuelve el identificador que se guarda en el claim "sub" del JWT
    public function getJWTIdentifier(): mixed
    {
        return $this->getKey(); // El UUID del usuario
    }

    // Claims custom adicionales que se incluyen en cada JWT generado
    public function getJWTCustomClaims(): array
    {
        return [];
    }

    // Tymon necesita saber cuál es el campo de la contraseña
    // En nuestra BD se llama 'contrasenya', no 'password'
    public function getAuthPassword(): string
    {
        return $this->contrasenya;
    }
}
