<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class Usuari extends Model
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
        return $this->hasMany(UsuariRol::class, 'usuariId');
    }

    public function equipUsuaris(): HasMany
    {
        return $this->hasMany(EquipUsuari::class, 'usuariId');
    }

    public function notificacions(): HasMany
    {
        return $this->hasMany(Notificacio::class, 'usuariId');
    }

    public function compras(): HasMany
    {
        return $this->hasMany(Compra::class, 'usuariId');
    }

    public function seguros(): HasMany
    {
        return $this->hasMany(Seguro::class, 'usuariId');
    }

    // ─── Helpers de roles y permisos ────────────────────────────────────────────

    /** Retorna array de strings de roles activos del usuario */
    public function getRolesArray(): array
    {
        if (!$this->relationLoaded('rols')) {
            $this->load(['rols' => fn($q) => $q->where('isActive', true)]);
        }
        return $this->rols->where('isActive', true)->pluck('rol')->toArray();
    }

    /** Retorna array de nombres de permisos basados en los roles */
    public function getPermissionsArray(): array
    {
        $roles = $this->getRolesArray();
        if (empty($roles)) {
            return [];
        }

        return DB::table('permissions')
            ->join('role_permissions', 'permissions.id', '=', 'role_permissions.permission_id')
            ->whereIn('role_permissions.rol', $roles)
            ->pluck('permissions.name')
            ->unique()
            ->toArray();
    }

    public function hasRole(string $role): bool
    {
        return in_array($role, $this->getRolesArray());
    }

    public function hasAnyRole(array $roles): bool
    {
        return !empty(array_intersect($roles, $this->getRolesArray()));
    }

    public function hasPermission(string $permission): bool
    {
        return in_array($permission, $this->getPermissionsArray());
    }
}
