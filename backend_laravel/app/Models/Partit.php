<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Partit extends Model
{
    protected $table = 'partits';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'jornadaId',
        'localId',
        'visitantId',
        'dataHora',
        'pistaId',
        'arbitreId',
        'usuariId',
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
        return $this->belongsTo(Jornada::class, 'jornadaId');
    }

    public function local(): BelongsTo
    {
        return $this->belongsTo(Equip::class, 'localId');
    }

    public function visitant(): BelongsTo
    {
        return $this->belongsTo(Equip::class, 'visitantId');
    }

    public function pista(): BelongsTo
    {
        return $this->belongsTo(Pista::class, 'pistaId');
    }

    public function arbitre(): BelongsTo
    {
        return $this->belongsTo(Usuari::class, 'arbitreId');
    }

    public function usuari(): BelongsTo
    {
        return $this->belongsTo(Usuari::class, 'usuariId');
    }

    public function acta(): HasOne
    {
        return $this->hasOne(Acta::class, 'partitId');
    }

    public function alineacions(): HasMany
    {
        return $this->hasMany(Alineacio::class, 'partitId');
    }

    public function partitJugadors(): HasMany
    {
        return $this->hasMany(PartitJugador::class, 'partitId');
    }

    public function puntuacions(): HasMany
    {
        return $this->hasMany(Puntuacio::class, 'partitId');
    }

    public function setPartits(): HasMany
    {
        return $this->hasMany(SetPartit::class, 'partitId');
    }
}
