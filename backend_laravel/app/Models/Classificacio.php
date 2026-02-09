<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Classificacio extends Model
{
    use HasUuids;

    protected $table = 'classificacions';

    protected $fillable = [
        'id',
        'lligaId',
        'equipId',
        'partitsJugats',
        'partitsGuanyats',
        'partitsPerduts',
        'partitsEmpatats',
        'setsGuanyats',
        'setsPerduts',
        'jocsGuanyats',
        'jocsPerduts',
        'punts',
        'isActive',
    ];

    protected $casts = [
        'partitsJugats' => 'integer',
        'partitsGuanyats' => 'integer',
        'partitsPerduts' => 'integer',
        'partitsEmpatats' => 'integer',
        'setsGuanyats' => 'integer',
        'setsPerduts' => 'integer',
        'jocsGuanyats' => 'integer',
        'jocsPerduts' => 'integer',
        'punts' => 'integer',
        'isActive' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function lliga(): BelongsTo
    {
        return $this->belongsTo(Lliga::class, 'lligaId');
    }

    public function equip(): BelongsTo
    {
        return $this->belongsTo(Equip::class, 'equipId');
    }
}
