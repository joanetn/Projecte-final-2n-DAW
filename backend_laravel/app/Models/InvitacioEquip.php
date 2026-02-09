<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvitacioEquip extends Model
{
    use HasUuids;

    protected $table = 'invitacio_equips';

    protected $fillable = [
        'id',
        'equipId',
        'usuariId',
        'missatge',
        'estat',
        'isActive',
    ];

    protected $casts = [
        'isActive' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function equip(): BelongsTo
    {
        return $this->belongsTo(Equip::class, 'equipId');
    }

    public function usuari(): BelongsTo
    {
        return $this->belongsTo(Usuari::class, 'usuariId');
    }
}
