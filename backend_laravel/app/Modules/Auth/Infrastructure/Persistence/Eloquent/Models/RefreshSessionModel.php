<?php

// Modelo Eloquent para la tabla refresh_sessions
// Representa una sesión de refresh token vinculada a un usuario y dispositivo
// Cada fila = 1 dispositivo conectado del usuario

namespace App\Modules\Auth\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class RefreshSessionModel extends Model
{
    use HasUuids;

    protected $table = 'refresh_sessions';

    protected $fillable = [
        'id',
        'user_id',
        'device_id',
        'device_type',
        'browser',
        'os',
        'family_id',
        'current_token_hash',
        'revoked',
        'session_version',
        'last_used_at',
    ];

    protected $casts = [
        'revoked' => 'boolean',
        'session_version' => 'integer',
        'last_used_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
