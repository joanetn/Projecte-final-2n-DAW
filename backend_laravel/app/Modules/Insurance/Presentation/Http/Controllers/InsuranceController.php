<?php

namespace App\Modules\Insurance\Presentation\Http\Controllers;

use App\Models\UsuariRol;
use App\Modules\Insurance\Application\Commands\ConfirmInsurancePaymentCommand;
use App\Modules\Insurance\Application\Commands\CreateInsuranceCommand;
use App\Modules\Insurance\Application\Commands\HandleStripeWebhookCommand;
use App\Modules\Insurance\Application\DTOs\CreateInsuranceDTO;
use App\Modules\Insurance\Application\DTOs\UpdateInsuranceDTO;
use App\Modules\Insurance\Application\Queries\GetInsuranceQuery;
use App\Modules\Insurance\Application\Queries\GetInsurancesQuery;
use App\Modules\Insurance\Application\Queries\GetInsurancesByUserQuery;
use App\Modules\Insurance\Application\Queries\GetInsurancesAdminQuery;
use App\Modules\Insurance\Application\Queries\SearchInsurancesAdminQuery;
use App\Modules\Insurance\Domain\Exceptions\InsuranceNotFoundException;
use App\Modules\Insurance\Infrastructure\Persistence\Mappers\InsuranceMapper;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Tymon\JWTAuth\Facades\JWTAuth;

class InsuranceController extends Controller
{
    public function __construct(
        private CreateInsuranceCommand $createInsuranceCommand,
        private ConfirmInsurancePaymentCommand $confirmInsurancePaymentCommand,
        private HandleStripeWebhookCommand $handleStripeWebhookCommand,
        private GetInsuranceQuery $getInsuranceQuery,
        private GetInsurancesQuery $getInsurancesQuery,
        private GetInsurancesByUserQuery $getInsurancesByUserQuery,
        private GetInsurancesAdminQuery $getInsurancesAdminQuery,
        private SearchInsurancesAdminQuery $searchInsurancesAdminQuery,
    ) {}

    // ─── QUERIES ────────────────────────────────────────────────────────

    /**
     * Llistar tots els seguros actius (amb relació usuari).
     */
    public function index(): JsonResponse
    {
        $insurances = $this->getInsurancesQuery->execute();

        return response()->json([
            'success' => true,
            'data'    => array_map(fn($i) => InsuranceMapper::toArray($i), $insurances),
        ]);
    }

    /**
     * Obtenir un segur per ID.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $insurance = $this->getInsuranceQuery->execute($id);

            return response()->json([
                'success' => true,
                'data'    => InsuranceMapper::toArray($insurance),
            ]);
        } catch (InsuranceNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], $e->getCode());
        }
    }

    /**
     * Llistar seguros d'un usuari.
     */
    public function byUser(string $usuariId): JsonResponse
    {
        $insurances = $this->getInsurancesByUserQuery->execute($usuariId);

        return response()->json([
            'success' => true,
            'data'    => array_map(fn($i) => InsuranceMapper::toArray($i), $insurances),
        ]);
    }

    /**
     * Llistar tots els seguros (admin, inclou inactius).
     */
    public function indexAdmin(): JsonResponse
    {
        $insurances = $this->getInsurancesAdminQuery->execute();

        return response()->json([
            'success' => true,
            'data'    => array_map(fn($i) => InsuranceMapper::toArray($i), $insurances),
        ]);
    }

    /**
     * Cercar seguros amb filtres (admin).
     */
    public function searchAdmin(Request $request): JsonResponse
    {
        $q        = $request->query('q');
        $pagat    = $request->query('pagat') !== null ? filter_var($request->query('pagat'), FILTER_VALIDATE_BOOLEAN) : null;
        $minPrice = $request->query('minPrice');
        $maxPrice = $request->query('maxPrice');
        $sort     = $request->query('sort', 'created_at_desc');
        $page     = (int) $request->query('page', 1);
        $limit    = (int) $request->query('limit', 20);

        $result = $this->searchInsurancesAdminQuery->execute(
            q: $q,
            pagat: $pagat,
            minPrice: $minPrice,
            maxPrice: $maxPrice,
            sort: $sort,
            page: $page,
            limit: $limit
        );

        return response()->json([
            'success'      => true,
            'data'         => array_map(fn($i) => InsuranceMapper::toArray($i), $result['data']),
            'current_page' => $result['current_page'],
            'per_page'     => $result['per_page'],
            'last_page'    => $result['last_page'],
            'total'        => $result['total'],
        ]);
    }

    // ─── STRIPE PAYMENT ─────────────────────────────────────────────────

    /**
     * Crear un segur pendent + PaymentIntent de Stripe.
     * L'usuari autenticat contracta un segur.
     *
     * Body: { mesos?: int, preu?: float }
     * Retorna: { insuranceId, clientSecret }
     */
    public function createPaymentIntent(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'mesos' => 'sometimes|integer|min:1|max:36',
                'preu'  => 'sometimes|numeric|min:0.01',
            ]);

            $usuariId = (string) $request->input('auth_user_id');
            if (!$usuariId) {
                $usuariId = (string) JWTAuth::parseToken()->getPayload()->get('sub');
            }

            if (!$usuariId) {
                return response()->json([
                    'success' => false,
                    'message' => 'No autenticat',
                ], 401);
            }

            if (!$this->isPlayer($usuariId)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Només els usuaris amb rol JUGADOR poden pagar el segur',
                ], 403);
            }

            $dto = CreateInsuranceDTO::fromArray([
                'usuariId' => $usuariId,
                'mesos'    => $request->input('mesos', 12),
                'preu'     => $request->input('preu'),
            ]);

            $result = $this->createInsuranceCommand->execute($dto);

            return response()->json([
                'success'      => true,
                'message'      => 'PaymentIntent creat correctament',
                'insuranceId'  => $result['insuranceId'],
                'clientSecret' => $result['clientSecret'],
            ], 201);
        } catch (\Stripe\Exception\ApiErrorException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de Stripe: ' . $e->getMessage(),
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Confirmació manual del pagament del segur després del retorn de Stripe.
     * Serveix de fallback quan el webhook no s'ha processat encara.
     */
    public function confirmPayment(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'paymentIntentId' => 'required|string',
            ]);

            $usuariId = (string) $request->input('auth_user_id');
            if (!$usuariId) {
                $usuariId = (string) JWTAuth::parseToken()->getPayload()->get('sub');
            }

            if (!$usuariId) {
                return response()->json([
                    'success' => false,
                    'message' => 'No autenticat',
                ], 401);
            }

            if (!$this->isPlayer($usuariId)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Només els usuaris amb rol JUGADOR poden confirmar el pagament del segur',
                ], 403);
            }

            $result = $this->confirmInsurancePaymentCommand->execute(
                paymentIntentId: (string) $validated['paymentIntentId'],
                usuariId: $usuariId,
            );

            $statusCode = $result['status'] === 'error' ? 400 : 200;

            return response()->json([
                'success' => $result['status'] === 'ok',
                'message' => $result['message'],
            ], $statusCode);
        } catch (\Stripe\Exception\ApiErrorException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de Stripe: ' . $e->getMessage(),
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    // ─── WEBHOOK ─────────────────────────────────────────────────────────

    /**
     * Endpoint per rebre webhooks de Stripe.
     * NO requereix autenticació JWT — Stripe envia directament.
     */
    public function webhook(Request $request): JsonResponse
    {
        $payload   = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');

        if (!$sigHeader) {
            return response()->json([
                'success' => false,
                'message' => 'Falta el header Stripe-Signature',
            ], 400);
        }

        $result = $this->handleStripeWebhookCommand->execute($payload, $sigHeader);

        $statusCode = $result['status'] === 'error' ? 400 : 200;

        return response()->json([
            'success' => $result['status'] === 'ok',
            'message' => $result['message'],
        ], $statusCode);
    }

    private function isPlayer(string $usuariId): bool
    {
        return UsuariRol::query()
            ->where('usuariId', $usuariId)
            ->where('rol', 'JUGADOR')
            ->where('isActive', true)
            ->exists();
    }
}
