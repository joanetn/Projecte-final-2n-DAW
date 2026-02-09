<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Merch extends Model
{
    use HasUuids;

    protected $table = 'merchs';

    protected $fillable = [
        'id',
        'nom',
        'marca',
        'preu',
        'stock',
        'isActive',
    ];

    protected $casts = [
        'preu' => 'float',
        'stock' => 'integer',
        'isActive' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function compras(): HasMany
    {
        return $this->hasMany(Compra::class, 'merchId');
    }
}
