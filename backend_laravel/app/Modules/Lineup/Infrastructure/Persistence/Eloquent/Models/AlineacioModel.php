<?php

/**
 * Model Eloquent per a la taula 'alineacions'.
 *
 * Mapeja la taula de base de dades al model PHP.
 * Defineix les relacions amb altres models (partit, jugador, equip).
 * Utilitza UUIDs com a clau primària en lloc d'autoincrement.
 */

namespace App\Modules\Lineup\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AlineacioModel extends Model
{
    use HasUuids;

    protected $table = 'alineacions';

    // La taula no té timestamps estàndard, utilitza 'creada_at' personalitzat
    public $timestamps = false;

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

    /**
     * Relació N:1 amb Partit - L'alineació pertany a un partit.
     */
    public function partit(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Partit::class, 'partitId');
    }

    /**
     * Relació N:1 amb Usuari (jugador) - L'alineació pertany a un jugador.
     */
    public function jugador(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Usuari::class, 'jugadorId');
    }

    /**
     * Relació N:1 amb Equip - L'alineació pertany a un equip.
     */
    public function equip(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Equip::class, 'equipId');
    }
}
