<?php

/**
 * Model Eloquent per a la taula 'partit_jugadors'.
 *
 * Mapeja la taula de jugadors per partit al model PHP.
 * Cada registre representa la participació d'un jugador en un partit
 * amb els punts obtinguts. Utilitza UUIDs com a clau primària.
 */

namespace App\Modules\Lineup\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PartitJugadorModel extends Model
{
    use HasUuids;

    protected $table = 'partit_jugadors';

    // La taula no té timestamps estàndard
    public $timestamps = false;

    protected $fillable = [
        'id',
        'partitId',
        'jugadorId',
        'equipId',
        'punts',
        'isActive',
    ];

    protected $casts = [
        'punts' => 'integer',
        'isActive' => 'boolean',
    ];

    /**
     * Relació N:1 amb Partit - El registre pertany a un partit.
     */
    public function partit(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Partit::class, 'partitId');
    }

    /**
     * Relació N:1 amb Usuari (jugador) - El registre pertany a un jugador.
     */
    public function jugador(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Usuari::class, 'jugadorId');
    }

    /**
     * Relació N:1 amb Equip - El registre pertany a un equip.
     */
    public function equip(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Equip::class, 'equipId');
    }
}
