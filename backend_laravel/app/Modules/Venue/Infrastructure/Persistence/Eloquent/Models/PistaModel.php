<?php

namespace App\Modules\Venue\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PistaModel extends Model
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
        return $this->belongsTo(\App\Models\Instalacio::class, 'instalacioId');
    }

    public function partits(): HasMany
    {
        return $this->hasMany(\App\Models\Partit::class, 'pistaId');
    }
}
