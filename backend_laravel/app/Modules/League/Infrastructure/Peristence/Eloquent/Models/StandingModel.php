<?php

namespace App\Modules\League\Infrastructure\Peristence\Eloquent\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class StandingModel extends Model
{
    use HasUuids;

    protected $table = 'classificacions';

    protected $fillable = [
        'id',
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

    public function equip()
    {
        return $this->belongsTo(\App\Models\Equip::class, 'equipId');
    }
}
