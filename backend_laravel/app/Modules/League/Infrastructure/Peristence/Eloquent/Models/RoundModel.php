<?php

namespace App\Modules\League\Infrastructure\Peristence\Eloquent\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class RoundModel extends Model
{
    use HasUuids;

    protected $table = 'jornadas';

    protected $fillable = [
        'id',
        'nom',
        'lligaId',
        'isActive',
        'dataInici',
        'dataFi',
        'status',
    ];

    protected $casts = [
        'dataInici' => 'datetime',
        'dataFi' => 'datetime',
        'isActive' => 'boolean',
    ];

    public function lliga()
    {
        return $this->belongsTo(LeagueModel::class, 'lligaId');
    }

    public function partits()
    {
        return $this->hasMany(\App\Modules\Match\Infrastructure\Persistence\Eloquent\Models\MatchModel::class, 'jornadaId');
    }
}
