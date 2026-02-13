<?php

namespace App\Modules\Merchandise\Domain\Services;

use App\Modules\Merchandise\Domain\Entities\Merch;
use App\Modules\Merchandise\Domain\Exceptions\InsufficientStockException;

class MerchandiseDomainService
{
    public function validateStock(Merch $merch, int $quantitat): void
    {
        if ($merch->stock !== null && $merch->stock < $quantitat) {
            throw new InsufficientStockException($merch->id, $quantitat, $merch->stock);
        }
    }

    public function calculateTotal(float $preu, int $quantitat): float
    {
        return round($preu * $quantitat, 2);
    }
}
