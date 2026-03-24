<?php

namespace App\Modules\Insurance\Application\Commands;

use App\Modules\Insurance\Domain\Repositories\InsuranceRepositoryInterface;
use Illuminate\Support\Facades\Log;
use Stripe\StripeClient;

class ConfirmInsurancePaymentCommand
{
    private StripeClient $stripe;

    public function __construct(
        private InsuranceRepositoryInterface $repo,
    ) {
        $stripeSecret = (string) (config('services.stripe.secret') ?: getenv('STRIPE_SECRET_KEY') ?: '');
        if ($stripeSecret === '') {
            throw new \RuntimeException('STRIPE_SECRET_KEY no está configurada en el backend.');
        }

        $this->stripe = new StripeClient($stripeSecret);
    }

    /**
     * Confirma manualment un pagament de segur després del retorn de Stripe.
     * Útil com a fallback quan el webhook triga o no s'ha processat encara.
     *
     * @return array{status: string, message: string}
     */
    public function execute(string $paymentIntentId, string $usuariId): array
    {
        $paymentIntentId = trim($paymentIntentId);

        if ($paymentIntentId === '') {
            return ['status' => 'error', 'message' => 'paymentIntentId és obligatori'];
        }

        $paymentIntent = $this->stripe->paymentIntents->retrieve($paymentIntentId, []);
        $metadata = $paymentIntent->metadata;

        if (($metadata->type ?? null) !== 'insurance') {
            return ['status' => 'error', 'message' => 'El PaymentIntent no correspon a un segur'];
        }

        $metadataUserId = (string) ($metadata->usuari_id ?? '');
        if ($metadataUserId !== '' && $metadataUserId !== $usuariId) {
            return ['status' => 'error', 'message' => 'Aquest pagament no correspon a l\'usuari autenticat'];
        }

        $insurance = $this->repo->findByStripePaymentIntentId($paymentIntentId);
        if (!$insurance) {
            return ['status' => 'error', 'message' => 'Segur no trobat per aquest pagament'];
        }

        if ((string) $insurance->usuariId !== $usuariId) {
            return ['status' => 'error', 'message' => 'Aquest segur no correspon a l\'usuari autenticat'];
        }

        if ($insurance->pagat) {
            return ['status' => 'ok', 'message' => 'Segur ja estava pagat'];
        }

        if (($paymentIntent->status ?? null) !== 'succeeded') {
            return ['status' => 'ok', 'message' => 'El pagament encara no està confirmat'];
        }

        $this->repo->update($insurance->id, ['pagat' => true]);

        Log::info('Insurance payment confirmed manually', [
            'insurance_id' => $insurance->id,
            'payment_intent_id' => $paymentIntentId,
            'usuari_id' => $usuariId,
        ]);

        return ['status' => 'ok', 'message' => 'Pagament de segur confirmat correctament'];
    }
}
