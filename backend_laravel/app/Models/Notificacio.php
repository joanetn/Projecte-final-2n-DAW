<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notificacio extends Model
{
    protected $table = 'notificacions';
    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    const CREATED_AT = 'created_at';
    const UPDATED_AT = null;

    protected $fillable = [
        'id',
        'usuariId',
        'titol',
        'missatge',
        'tipus',
        'read',
        'llegit',
        'extra',
        'isActive',
    ];

    protected $casts = [
        'read' => 'boolean',
        'llegit' => 'boolean',
        'isActive' => 'boolean',
        'created_at' => 'datetime',
    ];

    public function usuari(): BelongsTo
    {
        return $this->belongsTo(Usuari::class, 'usuariId');
    }
}
