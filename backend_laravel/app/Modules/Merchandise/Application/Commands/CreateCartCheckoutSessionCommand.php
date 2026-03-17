<?php

namespace App\Modules\Merchandise\Application\Commands;

use App\Modules\Merchandise\Domain\Exceptions\CartEmptyException;
use App\Modules\Merchandise\Domain\Exceptions\CartNotFoundException;
use App\Modules\Merchandise\Domain\Exceptions\MerchNotFoundException;
use App\Modules\Merchandise\Domain\Repositories\CartRepositoryInterface;
use App\Modules\Merchandise\Domain\Repositories\MerchRepositoryInterface;
use App\Modules\Merchandise\Domain\Services\MerchandiseDomainService;
use Stripe\StripeClient;

class CreateCartCheckoutSessionCommand
{
    private StripeClient $stripe;

    public function __construct(
        private CartRepositoryInterface $cartRepository,
        private MerchRepositoryInterface $merchRepository,
        private MerchandiseDomainService $domainService,
    ) {
        $stripeSecret = (string) (config('services.stripe.secret') ?: getenv('STRIPE_SECRET_KEY') ?: '');
        if ($stripeSecret === '') {
            throw new \RuntimeException('STRIPE_SECRET_KEY no está configurada en el backend.');
        }

        $this->stripe = new StripeClient($stripeSecret);
    }

    /**
     * Crea una Stripe Checkout Session a partir del carret actiu de l'usuari.
     *
     * @return array{sessionId: string, checkoutUrl: string}
     */
    public function execute(string $usuariId, string $successUrl, string $cancelUrl): array
    {
        $cart = $this->cartRepository->findActiveByUsuariWithRelations($usuariId, ['items.merch']);

        if (!$cart) {
            throw new CartNotFoundException($usuariId);
        }

        $items = $cart->items ?? [];
        if (count($items) === 0) {
            throw new CartEmptyException();
        }

        $lineItems = [];

        foreach ($items as $item) {
            $merchId = (string) ($item['merchId'] ?? '');
            $quantitat = (int) ($item['quantitat'] ?? 0);

            if ($merchId === '' || $quantitat < 1) {
                continue;
            }

            $merch = $this->merchRepository->findById($merchId);
            if (!$merch) {
                throw new MerchNotFoundException($merchId);
            }

            $this->domainService->validateStock($merch, $quantitat);

            $amountCents = (int) round(((float) ($merch->preu ?? 0)) * 100);
            if ($amountCents < 1) {
                throw new \DomainException('El preu del producte no és vàlid per Stripe', 422);
            }

            $lineItems[] = [
                'price_data' => [
                    'currency' => 'eur',
                    'product_data' => [
                        'name' => $merch->nom ?? 'Producte merchandising',
                    ],
                    'unit_amount' => $amountCents,
                ],
                'quantity' => $quantitat,
            ];
        }

        if (count($lineItems) === 0) {
            throw new CartEmptyException();
        }

        $session = $this->stripe->checkout->sessions->create([
            'mode' => 'payment',
            'line_items' => $lineItems,
            'success_url' => $successUrl,
            'cancel_url' => $cancelUrl,
            'metadata' => [
                'type' => 'merch_cart',
                'cart_id' => $cart->id,
                'usuari_id' => $usuariId,
            ],
            'payment_intent_data' => [
                'metadata' => [
                    'type' => 'merch_cart',
                    'cart_id' => $cart->id,
                    'usuari_id' => $usuariId,
                ],
            ],
        ]);

        return [
            'sessionId' => $session->id,
            'checkoutUrl' => $session->url,
        ];
    }
}
