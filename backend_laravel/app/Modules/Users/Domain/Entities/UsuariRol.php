<?php

namespace App\Modules\Users\Domain\Entities;

use Illuminate\Database\Eloquent\Model;

class UsuariRol extends Model
{
    protected $table = 'usuari_rols';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'usuariId',
        'rol',
        'isActive',
    ];

    protected $casts = [
        'isActive' => 'boolean',
    ];

    public function usuari()
    {
        return $this->belongsTo(Usuari::class, 'usuariId', 'id');
    }
}
