<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Jornada extends Model
{
    protected $table = 'jornadas';
    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'id',
        'nom',
        'data',
        'lligaId',
        'status',
        'isActive',
    ];

    protected $casts = [
        'data' => 'datetime',
        'isActive' => 'boolean',
    ];

    public function lliga(): BelongsTo
    {
        return $this->belongsTo(Lliga::class, 'lligaId');
    }

    public function partits(): HasMany
    {
        return $this->hasMany(Partit::class, 'jornadaId');
    }
}
