<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SetPartit extends Model
{
    use HasUuids;

    protected $table = 'set_partits';
    public $timestamps = false;

    protected $fillable = [
        'id',
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

    public function partit(): BelongsTo
    {
        return $this->belongsTo(Partit::class, 'partitId');
    }
}
