<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticable;

class Usuario extends Authenticable
{
    protected $table = 'usuarios';
    protected $primaryKey = 'id';

    protected $fillable = [
        'nom',
        'email',
        'password',
        'rol',
    ];

    protected $hidden = [
        'password', 
    ];
}
