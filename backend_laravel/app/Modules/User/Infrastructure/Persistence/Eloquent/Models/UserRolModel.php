<?php

namespace App\Modules\User\Infrastructure\Persistence\Eloquent\Models;

use App\Models\Usuari;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserRolModel extends Model
{
    use HasUuids;

    protected $table = 'usuari_rols';

    public $timestamps = false;

    protected $fillable = [
        'id',
        'usuariId',
        'rol',
        'isActive',
        'createdAt',
    ];

    protected $casts = [
        'isActive' => 'boolean',
        'createdAt' => 'datetime',
    ];

    public function usuari(): BelongsTo
    {
        return $this->belongsTo(Usuari::class, 'usuariId');
    }
}
