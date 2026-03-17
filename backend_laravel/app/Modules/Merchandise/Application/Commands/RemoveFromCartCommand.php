<?php

namespace App\Modules\Merchandise\Application\Commands;

use App\Modules\Merchandise\Domain\Exceptions\CartItemNotFoundException;
use App\Modules\Merchandise\Domain\Exceptions\CartNotFoundException;
use App\Modules\Merchandise\Domain\Repositories\CartItemRepositoryInterface;
use App\Modules\Merchandise\Domain\Repositories\CartRepositoryInterface;
use Illuminate\Support\Facades\DB;

class RemoveFromCartCommand
{
    public function __construct(
        private CartRepositoryInterface $cartRepository,
        private CartItemRepositoryInterface $cartItemRepository,
    ) {}

    /**
     * Elimina un item del carret actiu del usuari.
     */
    public function execute(string $usuariId, string $itemId): string
    {
        return DB::transaction(function () use ($usuariId, $itemId) {
            $cart = $this->cartRepository->findActiveByUsuari($usuariId);
            if (!$cart) {
                throw new CartNotFoundException($usuariId);
            }

            $item = $this->cartItemRepository->findById($itemId);
            if (!$item || $item->cartId !== $cart->id) {
                throw new CartItemNotFoundException($itemId);
            }

            $this->cartItemRepository->delete($itemId);

            return $cart->id;
        });
    }
}
