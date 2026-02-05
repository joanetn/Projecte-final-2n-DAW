<?php

namespace App\Modules\League\Infrastructure\Peristence\Eloquent\Models;

use Illuminate\Database\Eloquent\Model;

class LeagueModel extends Model
{

    protected $table = 'lligues';

    protected $fillable = [
        'nom',
        'categoria',
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

    public function classificacions()
    {
        return $this->hasMany(StandingModel::class, 'lligaId');
    }

    public function jornades()
    {
        return $this->hasMany(RoundModel::class, 'lligaId');
    }
}
