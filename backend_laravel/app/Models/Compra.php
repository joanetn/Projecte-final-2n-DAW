<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Compra extends Model
{
    use HasUuids;

    protected $table = 'compras';
    public $timestamps = false;

    const CREATED_AT = 'created_at';
    const UPDATED_AT = null;

    protected $fillable = [
        'id',
        'usuariId',
        'merchId',
        'quantitat',
        'total',
        'pagat',
        'status',
        'isActive',
    ];

    protected $casts = [
        'quantitat' => 'integer',
        'total' => 'float',
        'pagat' => 'boolean',
        'isActive' => 'boolean',
        'created_at' => 'datetime',
    ];

    public function usuari(): BelongsTo
    {
        return $this->belongsTo(Usuari::class, 'usuariId');
    }

    public function merch(): BelongsTo
    {
        return $this->belongsTo(Merch::class, 'merchId');
    }
}
