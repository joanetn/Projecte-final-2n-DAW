<?php

/**
 * Model Eloquent per a la taula 'puntuacions'.
 *
 * Mapeja la taula de puntuacions al model PHP.
 * Cada registre representa els punts d'un jugador en un partit.
 * Utilitza UUIDs com a clau primària.
 */

namespace App\Modules\Lineup\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PuntuacioModel extends Model
{
    use HasUuids;

    protected $table = 'puntuacions';

    // La taula no té timestamps estàndard
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

    /**
     * Relació N:1 amb Partit - La puntuació pertany a un partit.
     */
    public function partit(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Partit::class, 'partitId');
    }

    /**
     * Relació N:1 amb Usuari (jugador) - La puntuació pertany a un jugador.
     */
    public function jugador(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Usuari::class, 'jugadorId');
    }
}
