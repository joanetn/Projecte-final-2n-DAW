<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UsuariRol extends Model
{
    use HasUuids;

    protected $table = 'usuari_rols';

    protected $fillable = [
        'id',
        'usuariId',
        'rol',
        'isActive',
    ];

    protected $casts = [
        'isActive' => 'boolean',
        'createdAt' => 'datetime',
        'updatedAt' => 'datetime',
    ];

    public function usuari(): BelongsTo
    {
        return $this->belongsTo(Usuari::class, 'usuariId');
    }
}
