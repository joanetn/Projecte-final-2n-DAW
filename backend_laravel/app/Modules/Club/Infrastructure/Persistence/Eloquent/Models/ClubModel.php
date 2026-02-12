<?php

namespace App\Modules\Club\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClubModel extends Model
{
    use HasUuids;

    protected $table = 'clubs';

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

    public function equips(): HasMany
    {
        return $this->hasMany(\App\Models\Equip::class, 'clubId');
    }

    public function creador(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Usuari::class, 'creadorId');
    }
}
