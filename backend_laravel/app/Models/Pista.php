<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pista extends Model
{
    use HasUuids;

    protected $table = 'pistes';

    protected $fillable = [
        'id',
        'nom',
        'tipus',
        'instalacioId',
        'isActive',
    ];

    protected $casts = [
        'isActive' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function instalacio(): BelongsTo
    {
        return $this->belongsTo(Instalacio::class, 'instalacioId');
    }

    public function partits(): HasMany
    {
        return $this->hasMany(Partit::class, 'pistaId');
    }
}
