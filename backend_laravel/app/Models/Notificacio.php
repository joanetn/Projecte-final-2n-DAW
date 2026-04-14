<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notificacio extends Model
{
    use HasUuids;

    protected $table = 'notificacions';

    protected $fillable = [
        'id',
        'user_id',
        'suceso',
        'channels',
        'tone',
        'urgencia',
        'data',
        'status',
        'llegit',
    ];

    protected $casts = [
        'llegit' => 'boolean',
        'channels' => 'array',
        'data' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function usuari(): BelongsTo
    {
        return $this->belongsTo(Usuari::class, 'user_id');
    }
}
