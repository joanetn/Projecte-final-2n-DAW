<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lliga extends Model
{
    protected $table = 'lligas';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'nom',
        'categoria',
        'dataInici',
        'status',
        'isActive',
    ];

    protected $casts = [
        'isActive' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function jornadas(): HasMany
    {
        return $this->hasMany(Jornada::class, 'lligaId');
    }

    public function equips(): HasMany
    {
        return $this->hasMany(Equip::class, 'lligaId');
    }

    public function classificacions(): HasMany
    {
        return $this->hasMany(Classificacio::class, 'lligaId');
    }
}
