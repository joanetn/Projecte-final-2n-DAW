<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticable;

class Usuaris extends Authenticable
{
    protected $table = 'Usuari';
    protected $primaryKey = 'id';

    protected $fillable = [
        'nom',
        'email',
        'contrasenya',
    ];

    protected $hidden = [
        'contrasenya',
    ];

    protected $with = ['rols'];

    public function rols()
    {
        return $this->hasMany(UsuariRol::class, 'usuariId', 'id');
    }
}
