<?php

namespace App\Modules\Merchandise\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CartModel extends Model
{
    use HasUuids;

    protected $table = 'carts';

    protected $fillable = [
        'id',
        'usuariId',
        'isActive',
    ];

    protected $casts = [
        'isActive' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(CartItemModel::class, 'cartId');
    }
}
