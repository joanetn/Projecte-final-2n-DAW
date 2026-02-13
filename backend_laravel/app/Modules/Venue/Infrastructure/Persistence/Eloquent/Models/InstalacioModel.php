<?php

namespace App\Modules\Venue\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InstalacioModel extends Model
{
    use HasUuids;

    protected $table = 'instalacions';

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
        return $this->belongsTo(\App\Models\Club::class, 'clubId');
    }

    public function pistes(): HasMany
    {
        return $this->hasMany(\App\Models\Pista::class, 'instalacioId');
    }
}
