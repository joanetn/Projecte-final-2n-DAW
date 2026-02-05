<?php

namespace App\Modules\League\Infrastructure\Peristence\Eloquent\Models;

use Illuminate\Database\Eloquent\Model;

class StandingModel extends Model
{
    protected $table = 'classificacions';

    protected $fillable = [
        'lligaId',
        'equipId',
        'partitsJugats',
        'partitsGuanyats',
        'setsGuanyats',
        'setPerduts',
        'jocsGuanyats',
        'jocsPerduts',
        'punts',
        'isActive',
    ];

    protected $casts = [
        'partitsJugats' => 'integer',
        'partitsGuanyats' => 'integer',
        'setsGuanyats' => 'integer',
        'setPerduts' => 'integer',
        'jocsGuanyats' => 'integer',
        'jocsPerduts' => 'integer',
        'punts' => 'integer',
        'isActive' => 'boolean',
    ];

    public function lliga()
    {
        return $this->belongsTo(LeagueModel::class, 'lligaId');
    }

    // public function equip()
    // {
    //     return $this->belongsTo(EquipModel::class, 'equipId');
    // }
}
