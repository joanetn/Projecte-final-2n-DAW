<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Acta extends Model
{
    protected $table = 'actas';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'partitId',
        'arbitreId',
        'setsLocal',
        'setsVisitant',
        'observacions',
        'incidencies',
        'validada',
        'dataValidacio',
        'isActive',
    ];

    protected $casts = [
        'setsLocal' => 'integer',
        'setsVisitant' => 'integer',
        'validada' => 'boolean',
        'dataValidacio' => 'datetime',
        'isActive' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function partit(): BelongsTo
    {
        return $this->belongsTo(Partit::class, 'partitId');
    }

    public function arbitre(): BelongsTo
    {
        return $this->belongsTo(Usuari::class, 'arbitreId');
    }
}
