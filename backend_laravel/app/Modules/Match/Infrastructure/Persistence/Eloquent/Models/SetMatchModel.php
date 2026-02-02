<?php

namespace App\Modules\Match\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class SetMatchModel extends Model
{
    use HasUuids;

    protected $table = 'set_partits';

    public $timestamps = false;

    protected $fillable = [
        'partitId',
        'numeroSet',
        'jocsLocal',
        'jocsVisit',
        'tiebreak',
        'puntsLocalTiebreak',
        'puntsVisitTiebreak',
    ];

    protected $casts = [
        'numeroSet' => 'integer',
        'jocsLocal' => 'integer',
        'jocsVisit' => 'integer',
        'tiebreak' => 'boolean',
        'puntsLocalTiebreak' => 'integer',
        'puntsVisitTiebreak' => 'integer',
    ];

    public function partit()
    {
        return $this->belongsTo(\App\Models\Partit::class, 'partitId');
    }
}
