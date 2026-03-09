<?php

namespace App\Modules\Insurance\Application\Commands;

use App\Modules\Insurance\Domain\Repositories\InsuranceRepositoryInterface;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;

class HandleStripeWebhookCommand
{
    public function __construct(
        private InsuranceRepositoryInterface $repo
    ) {}

    /**
     * Processa el webhook de Stripe per confirmar pagaments de seguros.
     *
     * @param string $payload     El body raw de la petició
     * @param string $sigHeader   El header Stripe-Signature
     * @return array{status: string, message: string}
     */
    public function execute(string $payload, string $sigHeader): array
    {
        $webhookSecret = config('services.stripe.webhook_secret');

        // 1. Verificar la signatura de Stripe
        try {
            $event = Webhook::constructEvent(
                $payload,
                $sigHeader,
                $webhookSecret
            );
        } catch (\UnexpectedValueException $e) {
            Log::error('Stripe webhook: payload invàlid', ['error' => $e->getMessage()]);
            return ['status' => 'error', 'message' => 'Payload invàlid'];
        } catch (SignatureVerificationException $e) {
            Log::error('Stripe webhook: signatura invàlida', ['error' => $e->getMessage()]);
            return ['status' => 'error', 'message' => 'Signatura invàlida'];
        }

        // 2. Processar només events de pagament completat
        if ($event->type === 'payment_intent.succeeded') {
            return $this->handlePaymentIntentSucceeded($event->data->object);
        }

        if ($event->type === 'payment_intent.payment_failed') {
            return $this->handlePaymentIntentFailed($event->data->object);
        }

        // Event no gestionat
        Log::info('Stripe webhook: event ignorat', ['type' => $event->type]);
        return ['status' => 'ok', 'message' => "Event {$event->type} ignorat"];
    }

    /**
     * Gestiona un PaymentIntent completat amb èxit.
     */
    private function handlePaymentIntentSucceeded(object $paymentIntent): array
    {
        $paymentIntentId = $paymentIntent->id;
        $metadata = $paymentIntent->metadata;

        // Verificar que és un pagament de tipus insurance
        if (($metadata->type ?? null) !== 'insurance') {
            Log::info('Stripe webhook: PaymentIntent no és de tipus insurance', [
                'payment_intent_id' => $paymentIntentId,
            ]);
            return ['status' => 'ok', 'message' => 'No és un pagament de segur'];
        }

        // Buscar el segur pel stripe_payment_intent_id
        $insurance = $this->repo->findByStripePaymentIntentId($paymentIntentId);

        if (!$insurance) {
            Log::warning('Stripe webhook: segur no trobat', [
                'payment_intent_id' => $paymentIntentId,
            ]);
            return ['status' => 'error', 'message' => 'Segur no trobat'];
        }

        // Idempotència: si ja està pagat, no fer res
        if ($insurance->pagat) {
            Log::info('Stripe webhook: segur ja pagat (idempotent)', [
                'insurance_id' => $insurance->id,
            ]);
            return ['status' => 'ok', 'message' => 'Segur ja estava pagat'];
        }

        // Marcar com a pagat
        $this->repo->update($insurance->id, [
            'pagat' => true,
        ]);

        Log::info('Stripe webhook: segur marcat com a pagat', [
            'insurance_id'      => $insurance->id,
            'payment_intent_id' => $paymentIntentId,
        ]);

        return ['status' => 'ok', 'message' => 'Pagament confirmat correctament'];
    }

    /**
     * Gestiona un PaymentIntent fallit.
     */
    private function handlePaymentIntentFailed(object $paymentIntent): array
    {
        $paymentIntentId = $paymentIntent->id;
        $metadata = $paymentIntent->metadata;

        if (($metadata->type ?? null) !== 'insurance') {
            return ['status' => 'ok', 'message' => 'No és un pagament de segur'];
        }

        Log::warning('Stripe webhook: pagament fallit', [
            'payment_intent_id' => $paymentIntentId,
            'insurance_id'      => $metadata->insurance_id ?? null,
        ]);

        return ['status' => 'ok', 'message' => 'Pagament fallit registrat'];
    }
}
