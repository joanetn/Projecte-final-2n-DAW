<?php

namespace App\Http\Controllers;

use App\Modules\Insurance\Application\Commands\HandleStripeWebhookCommand as HandleInsuranceStripeWebhookCommand;
use App\Modules\Merchandise\Application\Commands\HandleMerchStripeWebhookCommand;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StripeWebhookController extends Controller
{
    public function __construct(
        private HandleMerchStripeWebhookCommand $handleMerchStripeWebhookCommand,
        private HandleInsuranceStripeWebhookCommand $handleInsuranceStripeWebhookCommand,
    ) {}

    public function handle(Request $request): JsonResponse
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');

        if (!$sigHeader) {
            return response()->json([
                'success' => false,
                'message' => 'Falta el header Stripe-Signature',
            ], 400);
        }

        $merchResult = $this->handleMerchStripeWebhookCommand->execute($payload, $sigHeader);
        $insuranceResult = $this->handleInsuranceStripeWebhookCommand->execute($payload, $sigHeader);

        $hasError = $merchResult['status'] === 'error' || $insuranceResult['status'] === 'error';

        return response()->json([
            'success' => !$hasError,
            'message' => $hasError
                ? 'Error processant webhook Stripe'
                : 'Webhook Stripe processat correctament',
            'details' => [
                'merchandise' => $merchResult['message'],
                'insurance' => $insuranceResult['message'],
            ],
        ], $hasError ? 400 : 200);
    }
}
