<?php

namespace App\Modules\Users\Domain\Entities;

use Illuminate\Database\Eloquent\Model;

class Usuari extends Model
{
    protected $table = 'usuaris';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

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

    protected $hidden = [
        'contrasenya',
    ];

    protected $casts = [
        'dataNaixement' => 'datetime',
        'isActive' => 'boolean',
    ];

    public function rols()
    {
        return $this->hasMany(UsuariRol::class, 'usuariId', 'id');
    }

    // public function notificacions()
    // {
    //     return $this->hasMany(Notificacio::class, 'usuariId', 'id');
    // }
}
