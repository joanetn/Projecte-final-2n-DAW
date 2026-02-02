<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Usuari extends Model
{
    protected $table = 'usuaris';
    protected $keyType = 'string';
    public $incrementing = false;

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
}
