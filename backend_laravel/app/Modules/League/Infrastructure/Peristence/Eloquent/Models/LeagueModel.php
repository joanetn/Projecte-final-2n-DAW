<?php

namespace App\Modules\League\Infrastructure\Peristence\Eloquent\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class LeagueModel extends Model
{
    use HasUuids;

    protected $table = 'lligues';

    protected $fillable = [
        'id',
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

    public function equips()
    {
        return $this->hasMany(\App\Models\Equip::class, 'lligaId', 'id');
    }
}
