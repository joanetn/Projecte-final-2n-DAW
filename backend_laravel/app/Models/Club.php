<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Club extends Model
{
    protected $table = 'clubs';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'nom',
        'descripcio',
        'adreca',
        'ciutat',
        'codiPostal',
        'provincia',
        'telefon',
        'email',
        'web',
        'anyFundacio',
        'creadorId',
        'isActive',
    ];

    protected $casts = [
        'anyFundacio' => 'integer',
        'isActive' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function creador(): BelongsTo
    {
        return $this->belongsTo(Usuari::class, 'creadorId');
    }

    public function equips(): HasMany
    {
        return $this->hasMany(Equip::class, 'clubId');
    }

    public function instalacions(): HasMany
    {
        return $this->hasMany(Instalacio::class, 'clubId');
    }
}
