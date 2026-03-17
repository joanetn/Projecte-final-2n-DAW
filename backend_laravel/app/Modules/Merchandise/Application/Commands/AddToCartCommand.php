<?php

namespace App\Modules\Merchandise\Application\Commands;

use App\Modules\Merchandise\Domain\Exceptions\MerchNotFoundException;
use App\Modules\Merchandise\Domain\Repositories\CartItemRepositoryInterface;
use App\Modules\Merchandise\Domain\Repositories\CartRepositoryInterface;
use App\Modules\Merchandise\Domain\Repositories\MerchRepositoryInterface;
use App\Modules\Merchandise\Domain\Services\MerchandiseDomainService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AddToCartCommand
{
    public function __construct(
        private CartRepositoryInterface $cartRepository,
        private CartItemRepositoryInterface $cartItemRepository,
        private MerchRepositoryInterface $merchRepository,
        private MerchandiseDomainService $domainService,
    ) {}

    /**
     * Afegeix un producte al carret actiu del usuari.
     * Si ja existeix l'item per al mateix merch, incrementa la quantitat.
     */
    public function execute(string $usuariId, string $merchId, int $quantitat): string
    {
        return DB::transaction(function () use ($usuariId, $merchId, $quantitat) {
            $merch = $this->merchRepository->findById($merchId);
            if (!$merch) {
                throw new MerchNotFoundException($merchId);
            }

            $cart = $this->cartRepository->findActiveByUsuari($usuariId);
            $cartId = $cart?->id ?? Str::uuid()->toString();

            if (!$cart) {
                $this->cartRepository->create([
                    'id' => $cartId,
                    'usuariId' => $usuariId,
                    'isActive' => true,
                ]);
            }

            $existing = $this->cartItemRepository->findByCartAndMerch($cartId, $merchId);

            if ($existing) {
                $newQty = $existing->quantitat + $quantitat;
                $this->domainService->validateStock($merch, $newQty);

                $this->cartItemRepository->update($existing->id, [
                    'quantitat' => $newQty,
                ]);

                return $cartId;
            }

            $this->domainService->validateStock($merch, $quantitat);

            $this->cartItemRepository->create([
                'id' => Str::uuid()->toString(),
                'cartId' => $cartId,
                'merchId' => $merchId,
                'quantitat' => $quantitat,
                'isActive' => true,
            ]);

            return $cartId;
        });
    }
}
