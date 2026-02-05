<?php

namespace App\Modules\League\Infrastructure\Peristence\Eloquent\Models;

use Illuminate\Database\Eloquent\Model;

class RoundModel extends Model
{
    protected $table = 'jornadas';

    protected $fillable = [
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
        'lligaId' => 'integer',
    ];

    public function lliga()
    {
        return $this->belongsTo(LeagueModel::class, 'lligaId');
    }
}
