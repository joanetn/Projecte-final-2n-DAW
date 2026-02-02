<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Puntuacio extends Model
{
    protected $table = 'puntuacions';
    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'id',
        'partitId',
        'jugadorId',
        'punts',
        'isActive',
    ];

    protected $casts = [
        'punts' => 'integer',
        'isActive' => 'boolean',
    ];

    public function partit(): BelongsTo
    {
        return $this->belongsTo(Partit::class, 'partitId');
    }

    public function jugador(): BelongsTo
    {
        return $this->belongsTo(Usuari::class, 'jugadorId');
    }
}
