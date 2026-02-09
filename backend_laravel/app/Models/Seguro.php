<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Seguro extends Model
{
    use HasUuids;

    protected $table = 'seguros';

    protected $fillable = [
        'id',
        'usuariId',
        'dataExpiracio',
        'pagat',
        'isActive',
    ];

    protected $casts = [
        'dataExpiracio' => 'datetime',
        'pagat' => 'boolean',
        'isActive' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function usuari(): BelongsTo
    {
        return $this->belongsTo(Usuari::class, 'usuariId');
    }
}
