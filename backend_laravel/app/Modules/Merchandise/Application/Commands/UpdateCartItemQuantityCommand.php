<?php

namespace App\Modules\Merchandise\Application\Commands;

use App\Modules\Merchandise\Domain\Exceptions\CartItemNotFoundException;
use App\Modules\Merchandise\Domain\Exceptions\CartNotFoundException;
use App\Modules\Merchandise\Domain\Exceptions\MerchNotFoundException;
use App\Modules\Merchandise\Domain\Repositories\CartItemRepositoryInterface;
use App\Modules\Merchandise\Domain\Repositories\CartRepositoryInterface;
use App\Modules\Merchandise\Domain\Repositories\MerchRepositoryInterface;
use App\Modules\Merchandise\Domain\Services\MerchandiseDomainService;
use Illuminate\Support\Facades\DB;

class UpdateCartItemQuantityCommand
{
    public function __construct(
        private CartRepositoryInterface $cartRepository,
        private CartItemRepositoryInterface $cartItemRepository,
        private MerchRepositoryInterface $merchRepository,
        private MerchandiseDomainService $domainService,
    ) {}

    /**
     * Actualitza la quantitat d'un item del carret actiu del usuari.
     */
    public function execute(string $usuariId, string $itemId, int $quantitat): string
    {
        return DB::transaction(function () use ($usuariId, $itemId, $quantitat) {
            $cart = $this->cartRepository->findActiveByUsuari($usuariId);
            if (!$cart) {
                throw new CartNotFoundException($usuariId);
            }

            $item = $this->cartItemRepository->findById($itemId);
            if (!$item || $item->cartId !== $cart->id) {
                throw new CartItemNotFoundException($itemId);
            }

            $merch = $this->merchRepository->findById($item->merchId);
            if (!$merch) {
                throw new MerchNotFoundException($item->merchId);
            }

            $this->domainService->validateStock($merch, $quantitat);

            $this->cartItemRepository->update($itemId, [
                'quantitat' => $quantitat,
            ]);

            return $cart->id;
        });
    }
}
