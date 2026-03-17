<?php

namespace App\Modules\Merchandise\Application\Queries;

use App\Modules\Merchandise\Domain\Entities\Cart;
use App\Modules\Merchandise\Domain\Repositories\CartRepositoryInterface;
use Illuminate\Support\Str;

class GetMyCartQuery
{
    public function __construct(
        private CartRepositoryInterface $cartRepository,
    ) {}

    /**
     * Retorna el carret actiu de l'usuari amb items + merch.
     * Si no existeix, el crea buit.
     */
    public function execute(string $usuariId): Cart
    {
        $cart = $this->cartRepository->findActiveByUsuariWithRelations($usuariId, ['items.merch']);
        if ($cart) {
            return $cart;
        }

        $cartId = Str::uuid()->toString();
        $this->cartRepository->create([
            'id' => $cartId,
            'usuariId' => $usuariId,
            'isActive' => true,
        ]);

        return $this->cartRepository->findByIdWithRelations($cartId, ['items.merch']);
    }
}
