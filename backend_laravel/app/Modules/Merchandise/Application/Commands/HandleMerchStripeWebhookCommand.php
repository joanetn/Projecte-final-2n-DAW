<?php

namespace App\Modules\Merchandise\Application\Commands;

use App\Modules\Merchandise\Domain\Repositories\CartItemRepositoryInterface;
use App\Modules\Merchandise\Domain\Repositories\CartRepositoryInterface;
use App\Modules\Merchandise\Domain\Repositories\CompraRepositoryInterface;
use App\Modules\Merchandise\Domain\Repositories\MerchRepositoryInterface;
use App\Modules\Merchandise\Domain\Services\MerchandiseDomainService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;

class HandleMerchStripeWebhookCommand
{
    public function __construct(
        private CartRepositoryInterface $cartRepository,
        private CartItemRepositoryInterface $cartItemRepository,
        private CompraRepositoryInterface $compraRepository,
        private MerchRepositoryInterface $merchRepository,
        private MerchandiseDomainService $domainService,
    ) {}

    /**
     * Processa webhooks Stripe de pagaments de merchandising.
     *
     * @return array{status: string, message: string}
     */
    public function execute(string $payload, string $sigHeader): array
    {
        $webhookSecret = config('services.stripe.webhook_secret');

        try {
            $event = Webhook::constructEvent(
                $payload,
                $sigHeader,
                $webhookSecret
            );
        } catch (\UnexpectedValueException $e) {
            Log::error('Merch Stripe webhook: payload invàlid', ['error' => $e->getMessage()]);
            return ['status' => 'error', 'message' => 'Payload invàlid'];
        } catch (SignatureVerificationException $e) {
            Log::error('Merch Stripe webhook: signatura invàlida', ['error' => $e->getMessage()]);
            return ['status' => 'error', 'message' => 'Signatura invàlida'];
        }

        if ($event->type === 'checkout.session.completed') {
            return $this->handleCheckoutSessionCompleted($event->data->object);
        }

        if ($event->type === 'payment_intent.payment_failed') {
            $pi = $event->data->object;
            $metadata = $pi->metadata;

            if (($metadata->type ?? null) === 'merch_cart') {
                Log::warning('Merch Stripe webhook: pagament fallit', [
                    'payment_intent_id' => $pi->id,
                    'cart_id' => $metadata->cart_id ?? null,
                ]);
            }

            return ['status' => 'ok', 'message' => 'Pagament fallit registrat'];
        }

        Log::info('Merch Stripe webhook: event ignorat', ['type' => $event->type]);
        return ['status' => 'ok', 'message' => "Event {$event->type} ignorat"];
    }

    /**
     * checkout.session.completed → crear compres pagades, descomptar estoc
     * i tancar (inactivar) el carret per idempotència.
     */
    private function handleCheckoutSessionCompleted(object $session): array
    {
        $metadata = $session->metadata;

        if (($metadata->type ?? null) !== 'merch_cart') {
            return ['status' => 'ok', 'message' => 'No és un checkout de merchandising'];
        }

        $cartId = (string) ($metadata->cart_id ?? '');
        if ($cartId === '') {
            return ['status' => 'error', 'message' => 'Falta cart_id a metadata'];
        }

        if (($session->payment_status ?? null) !== 'paid') {
            return ['status' => 'ok', 'message' => 'Checkout encara no pagat'];
        }

        $cart = $this->cartRepository->findByIdWithRelations($cartId, ['items.merch']);

        // Idempotència: si no hi és actiu, ja es va processar (o no existeix)
        if (!$cart) {
            Log::info('Merch Stripe webhook: carret no trobat o ja processat', [
                'cart_id' => $cartId,
                'session_id' => $session->id ?? null,
            ]);
            return ['status' => 'ok', 'message' => 'Carret no actiu o ja processat'];
        }

        $items = $cart->items ?? [];
        if (count($items) === 0) {
            // Sense items: tanquem igualment el carret actiu
            $this->cartRepository->delete($cart->id);
            return ['status' => 'ok', 'message' => 'Carret buit, marcat com processat'];
        }

        DB::beginTransaction();

        try {
            foreach ($items as $item) {
                $merchId = (string) ($item['merchId'] ?? '');
                $quantitat = (int) ($item['quantitat'] ?? 0);

                if ($merchId === '' || $quantitat < 1) {
                    continue;
                }

                $merch = $this->merchRepository->findByIdWithLock($merchId);
                if (!$merch) {
                    throw new \DomainException("Producte no trobat al processar checkout: {$merchId}", 404);
                }

                $this->domainService->validateStock($merch, $quantitat);

                $total = $this->domainService->calculateTotal($merch->preu ?? 0, $quantitat);

                $this->compraRepository->create([
                    'id' => Str::uuid()->toString(),
                    'usuariId' => $cart->usuariId,
                    'merchId' => $merchId,
                    'quantitat' => $quantitat,
                    'total' => $total,
                    'pagat' => true,
                    'status' => 'PAGAT',
                    'isActive' => true,
                ]);

                if ($merch->stock !== null) {
                    $this->merchRepository->update($merch->id, [
                        'stock' => $merch->stock - $quantitat,
                    ]);
                }
            }

            // Inactivar items i carret per evitar reprocessament de webhook duplicat
            $this->cartItemRepository->deleteByCart($cart->id);
            $this->cartRepository->delete($cart->id);

            DB::commit();

            Log::info('Merch Stripe webhook: checkout processat correctament', [
                'cart_id' => $cart->id,
                'usuari_id' => $cart->usuariId,
                'session_id' => $session->id ?? null,
            ]);

            return ['status' => 'ok', 'message' => 'Checkout processat correctament'];
        } catch (\Throwable $e) {
            DB::rollBack();

            Log::error('Merch Stripe webhook: error processant checkout', [
                'cart_id' => $cart->id,
                'session_id' => $session->id ?? null,
                'error' => $e->getMessage(),
            ]);

            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }
}
