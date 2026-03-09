<?php

namespace App\Modules\Insurance\Application\Commands;

use App\Modules\Insurance\Application\DTOs\CreateInsuranceDTO;
use App\Modules\Insurance\Domain\Repositories\InsuranceRepositoryInterface;
use App\Modules\Insurance\Domain\Services\InsuranceDomainService;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Stripe\StripeClient;

class CreateInsuranceCommand
{
    private StripeClient $stripe;

    public function __construct(
        private InsuranceRepositoryInterface $repo,
        private InsuranceDomainService $service
    ) {
        $this->stripe = new StripeClient(config('services.stripe.secret'));
    }

    /**
     * Crea un segur pendent i genera un PaymentIntent de Stripe.
     *
     * @return array{insuranceId: string, clientSecret: string}
     */
    public function execute(CreateInsuranceDTO $dto): array
    {
        // Calcular data d'expiració basada en els mesos
        $dataExpiracio = $dto->dataExpiracio
            ?? Carbon::now()->addMonths($dto->mesos)->format('Y-m-d');

        // Calcular el preu (en euros)
        $preu = $dto->preu ?? $this->calculatePrice($dto->mesos);

        // Convertir a cèntims per Stripe
        $amountCents = (int) round($preu * 100);

        return DB::transaction(function () use ($dto, $dataExpiracio, $preu, $amountCents) {
            // 1. Crear el segur pendent a la BD
            $insurance = $this->repo->create([
                'usuariId'                 => $dto->usuariId,
                'dataExpiracio'            => $dataExpiracio,
                'pagat'                    => false,
                'stripe_payment_intent_id' => null,
                'preu'                     => $preu,
                'mesos'                    => $dto->mesos,
                'isActive'                 => true,
            ]);

            // 2. Crear PaymentIntent a Stripe
            $paymentIntent = $this->stripe->paymentIntents->create([
                'amount'   => $amountCents,
                'currency' => 'eur',
                'metadata' => [
                    'insurance_id' => $insurance->id,
                    'usuari_id'    => $dto->usuariId,
                    'mesos'        => $dto->mesos,
                    'type'         => 'insurance',
                ],
                'automatic_payment_methods' => [
                    'enabled' => true,
                ],
            ]);

            // 3. Guardar el payment_intent_id al segur
            $this->repo->update($insurance->id, [
                'stripe_payment_intent_id' => $paymentIntent->id,
            ]);

            return [
                'insuranceId'  => $insurance->id,
                'clientSecret' => $paymentIntent->client_secret,
            ];
        });
    }

    /**
     * Calcula el preu base segons els mesos.
     */
    private function calculatePrice(int $mesos): float
    {
        // Preu base: 10€/mes
        return round($mesos * 10.0, 2);
    }
}
