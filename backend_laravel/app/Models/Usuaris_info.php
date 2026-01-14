<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticable;

class Usuaris_info extends Authenticable
{
    protected $table = 'Usuari';
    protected $primaryKey = 'id';

}