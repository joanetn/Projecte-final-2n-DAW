<?php

namespace App\Modules\Club\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EquipUsuariModel extends Model
{
    use HasUuids;

    protected $table = 'equip_usuaris';
    public $timestamps = false;

    protected $fillable = [
        'id',
        'equipId',
        'usuariId',
        'rolEquip',
        'isActive',
    ];

    protected $casts = [
        'isActive' => 'boolean',
        'created_at' => 'datetime',
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
