<?php

namespace App\Modules\Auth\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class TokenBlacklistModel extends Model
{
    use HasUuids;

    protected $table = 'refresh_token_blacklist';

    protected $fillable = [
        'id',
        'user_id',
        'family_id',
        'token_hash',
        'expires_at',
        'revoked_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'revoked_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
