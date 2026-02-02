<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Instalacio extends Model
{
    protected $table = 'instalacions';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'nom',
        'adreca',
        'telefon',
        'tipusPista',
        'numPistes',
        'clubId',
        'isActive',
    ];

    protected $casts = [
        'numPistes' => 'integer',
        'isActive' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function club(): BelongsTo
    {
        return $this->belongsTo(Club::class, 'clubId');
    }

    public function pistes(): HasMany
    {
        return $this->hasMany(Pista::class, 'instalacioId');
    }
}
