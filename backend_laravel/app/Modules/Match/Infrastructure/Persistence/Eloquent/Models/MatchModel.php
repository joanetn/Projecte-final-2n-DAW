<?php

namespace App\Modules\Match\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MatchModel extends Model
{
    use HasUuids;

    protected $table = 'partits';

    protected $fillable = [
        'id',
        'jornadaId',
        'localId',
        'visitantId',
        'dataHora',
        'pistaId',
        'arbitreId',
        'status',
        'isActive',
    ];

    protected $casts = [
        'dataHora' => 'datetime',
        'isActive' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function jornada(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Jornada::class, 'jornadaId');
    }

    public function local(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Equip::class, 'localId');
    }

    public function visitant(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Equip::class, 'visitantId');
    }

    public function pista(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Pista::class, 'pistaId');
    }

    public function arbitre(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Usuari::class, 'arbitreId');
    }

    public function setPartits()
    {
        return $this->hasMany(\App\Models\SetPartit::class, 'partitId');
    }

    public function alineacions()
    {
        return $this->hasMany(\App\Models\Alineacio::class, 'partitId');
    }

    public function acta()
    {
        return $this->hasOne(\App\Models\Acta::class, 'partitId');
    }

    public function partitJugadors()
    {
        return $this->hasMany(\App\Models\PartitJugador::class, 'partitId');
    }

    public function puntuacions()
    {
        return $this->hasMany(\App\Models\Puntuacio::class, 'partitId');
    }
}
