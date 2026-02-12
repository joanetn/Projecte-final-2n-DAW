<?php

/**
 * Model Eloquent de Pista per a la capa d'infraestructura.
 *
 * Model específic del mòdul Venue per a pistes esportives.
 * Utilitza HasUuids per generar IDs UUID automàticament.
 * Cada pista pertany a una instal·lació i pot allotjar partits.
 */

namespace App\Modules\Venue\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PistaModel extends Model
{
    use HasUuids;

    // Taula de la base de dades associada
    protected $table = 'pistes';

    // Camps que es poden assignar massivament
    protected $fillable = [
        'id',
        'nom',
        'tipus',
        'instalacioId',
        'isActive',
    ];

    // Conversions de tipus automàtiques
    protected $casts = [
        'isActive' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relació: una pista pertany a una instal·lació.
     */
    public function instalacio(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Instalacio::class, 'instalacioId');
    }

    /**
     * Relació: una pista pot tenir molts partits.
     */
    public function partits(): HasMany
    {
        return $this->hasMany(\App\Models\Partit::class, 'pistaId');
    }
}
