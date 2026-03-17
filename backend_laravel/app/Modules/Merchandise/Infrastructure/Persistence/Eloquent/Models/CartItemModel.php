<?php

namespace App\Modules\Merchandise\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CartItemModel extends Model
{
    use HasUuids;

    protected $table = 'cart_items';

    protected $fillable = [
        'id',
        'cartId',
        'merchId',
        'quantitat',
        'isActive',
    ];

    protected $casts = [
        'quantitat' => 'integer',
        'isActive' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function cart(): BelongsTo
    {
        return $this->belongsTo(CartModel::class, 'cartId');
    }

    public function merch(): BelongsTo
    {
        return $this->belongsTo(MerchModel::class, 'merchId');
    }
}
