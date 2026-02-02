<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Equip extends Model
{
    protected $table = 'equips';
    protected $keyType = 'string';
    public $incrementing = false;

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
        return $this->belongsTo(Club::class, 'clubId');
    }

    public function lliga(): BelongsTo
    {
        return $this->belongsTo(Lliga::class, 'lligaId');
    }

    public function equipUsuaris(): HasMany
    {
        return $this->hasMany(EquipUsuari::class, 'equipId');
    }

    public function partitsLocal(): HasMany
    {
        return $this->hasMany(Partit::class, 'localId');
    }

    public function partitsVisitant(): HasMany
    {
        return $this->hasMany(Partit::class, 'visitantId');
    }

    public function classificacions(): HasMany
    {
        return $this->hasMany(Classificacio::class, 'equipId');
    }
}
