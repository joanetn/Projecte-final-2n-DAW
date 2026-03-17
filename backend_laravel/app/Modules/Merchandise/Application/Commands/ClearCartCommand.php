<?php

namespace App\Modules\Merchandise\Application\Commands;

use App\Modules\Merchandise\Domain\Repositories\CartItemRepositoryInterface;
use App\Modules\Merchandise\Domain\Repositories\CartRepositoryInterface;
use Illuminate\Support\Facades\DB;

class ClearCartCommand
{
    public function __construct(
        private CartRepositoryInterface $cartRepository,
        private CartItemRepositoryInterface $cartItemRepository,
    ) {}

    /**
     * Buida el carret actiu del usuari (si existeix).
     */
    public function execute(string $usuariId): ?string
    {
        return DB::transaction(function () use ($usuariId) {
            $cart = $this->cartRepository->findActiveByUsuari($usuariId);
            if (!$cart) {
                return null;
            }

            $this->cartItemRepository->deleteByCart($cart->id);
            return $cart->id;
        });
    }
}
