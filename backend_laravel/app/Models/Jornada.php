<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Jornada extends Model
{
    use HasUuids;

    protected $table = 'jornadas';
    public $timestamps = false;

    protected $fillable = [
        'id',
        'nom',
        'dataInici',
        'dataFi',
        'lligaId',
        'status',
        'isActive',
    ];

    protected $casts = [
        'dataInici' => 'datetime',
        'dataFi' => 'datetime',
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
