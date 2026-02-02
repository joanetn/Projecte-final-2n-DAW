<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Alineacio extends Model
{
    protected $table = 'alineacions';
    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    const CREATED_AT = 'creada_at';
    const UPDATED_AT = null;

    protected $fillable = [
        'id',
        'partitId',
        'jugadorId',
        'equipId',
        'posicio',
        'isActive',
    ];

    protected $casts = [
        'isActive' => 'boolean',
        'creada_at' => 'datetime',
    ];

    public function partit(): BelongsTo
    {
        return $this->belongsTo(Partit::class, 'partitId');
    }

    public function jugador(): BelongsTo
    {
        return $this->belongsTo(Usuari::class, 'jugadorId');
    }

    public function equip(): BelongsTo
    {
        return $this->belongsTo(Equip::class, 'equipId');
    }
}
