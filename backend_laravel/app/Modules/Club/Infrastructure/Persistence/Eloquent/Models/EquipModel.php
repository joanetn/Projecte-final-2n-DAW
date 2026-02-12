<?php

namespace App\Modules\Club\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EquipModel extends Model
{
    use HasUuids;

    protected $table = 'equips';

    protected $fillable = [
        'id',
        'nom',
        'categoria',
        'clubId',
        'lligaId',
        'isActive',
    ];

    protected $casts = [
        'isActive' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function club(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Club::class, 'clubId');
    }

    public function lliga(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Lliga::class, 'lligaId');
    }

    public function equipUsuaris(): HasMany
    {
        return $this->hasMany(\App\Models\EquipUsuari::class, 'equipId');
    }
}
