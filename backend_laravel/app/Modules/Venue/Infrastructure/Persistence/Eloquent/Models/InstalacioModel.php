<?php

/**
 * Model Eloquent d'Instal·lació per a la capa d'infraestructura.
 *
 * Aquest model NO és el model genèric de Laravel (app/Models/Instalacio.php).
 * És el model específic del mòdul Venue, utilitzat pel repositori Eloquent.
 * Utilitza HasUuids per generar IDs UUID automàticament.
 * Les relacions apunten als models genèrics de Laravel per compatibilitat.
 */

namespace App\Modules\Venue\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InstalacioModel extends Model
{
    use HasUuids;

    // Taula de la base de dades associada
    protected $table = 'instalacions';

    // Camps que es poden assignar massivament (mass assignment)
    protected $fillable = [
        'id',
        'nom',
        'adreca',
        'telefon',
        'tipusPista',
        'numPistes',
        'clubId',
        'isActive',
    ];

    // Conversions de tipus automàtiques (casting)
    protected $casts = [
        'numPistes' => 'integer',
        'isActive' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relació: una instal·lació pertany a un club.
     */
    public function club(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Club::class, 'clubId');
    }

    /**
     * Relació: una instal·lació té moltes pistes.
     */
    public function pistes(): HasMany
    {
        return $this->hasMany(\App\Models\Pista::class, 'instalacioId');
    }
}
