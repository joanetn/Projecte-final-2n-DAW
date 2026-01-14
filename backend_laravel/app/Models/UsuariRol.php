<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UsuariRol extends Model
{
    protected $table = 'UsuariRol';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'usuariId',
        'rol',
        'isActive',
    ];
}
