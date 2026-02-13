<?php

namespace App\Modules\Invitation\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvitacioEquipModel extends Model
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
        return $this->belongsTo(\App\Models\Equip::class, 'equipId');
    }

    public function usuari(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Usuari::class, 'usuariId');
    }
}
