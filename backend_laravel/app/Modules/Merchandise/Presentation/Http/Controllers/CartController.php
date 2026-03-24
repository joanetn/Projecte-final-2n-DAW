<?php

namespace App\Modules\Merchandise\Presentation\Http\Controllers;

use App\Modules\Merchandise\Application\Commands\AddToCartCommand;
use App\Modules\Merchandise\Application\Commands\ClearCartCommand;
use App\Modules\Merchandise\Application\Commands\CreateCartCheckoutSessionCommand;
use App\Modules\Merchandise\Application\Commands\HandleMerchStripeWebhookCommand;
use App\Modules\Merchandise\Application\Commands\RemoveFromCartCommand;
use App\Modules\Merchandise\Application\Commands\UpdateCartItemQuantityCommand;
use App\Modules\Merchandise\Domain\Exceptions\CartEmptyException;
use App\Modules\Merchandise\Application\Queries\GetMyCartQuery;
use App\Modules\Merchandise\Domain\Exceptions\CartItemNotFoundException;
use App\Modules\Merchandise\Domain\Exceptions\CartNotFoundException;
use App\Modules\Merchandise\Domain\Exceptions\InsufficientStockException;
use App\Modules\Merchandise\Domain\Exceptions\MerchNotFoundException;
use App\Modules\Merchandise\Presentation\Http\Requests\AddToCartRequest;
use App\Modules\Merchandise\Presentation\Http\Requests\CreateCartCheckoutSessionRequest;
use App\Modules\Merchandise\Presentation\Http\Requests\UpdateCartItemQuantityRequest;
use App\Modules\Merchandise\Presentation\Http\Resources\CartResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class CartController extends Controller
{
    public function __construct(
        private GetMyCartQuery $getMyCartQuery,
        private AddToCartCommand $addToCartCommand,
        private UpdateCartItemQuantityCommand $updateCartItemQuantityCommand,
        private RemoveFromCartCommand $removeFromCartCommand,
        private ClearCartCommand $clearCartCommand,
        private CreateCartCheckoutSessionCommand $createCartCheckoutSessionCommand,
        private HandleMerchStripeWebhookCommand $handleMerchStripeWebhookCommand,
    ) {}

    public function myCart(Request $request): JsonResponse
    {
        $usuariId = (string) $request->input('auth_user_id');
        if (!$usuariId) {
            return response()->json([
                'success' => false,
                'message' => 'No autenticat',
            ], 401);
        }

        $cart = $this->getMyCartQuery->execute($usuariId);

        return response()->json([
            'success' => true,
            'data' => new CartResource($cart),
        ]);
    }

    public function addItem(AddToCartRequest $request): JsonResponse
    {
        $usuariId = (string) $request->input('auth_user_id');
        if (!$usuariId) {
            return response()->json([
                'success' => false,
                'message' => 'No autenticat',
            ], 401);
        }

        try {
            $validated = $request->validated();

            $this->addToCartCommand->execute(
                usuariId: $usuariId,
                merchId: $validated['merchId'],
                quantitat: (int) $validated['quantitat'],
            );

            $cart = $this->getMyCartQuery->execute($usuariId);

            return response()->json([
                'success' => true,
                'message' => 'Producte afegit al carret',
                'data' => new CartResource($cart),
            ]);
        } catch (MerchNotFoundException | InsufficientStockException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], $e->getCode() ?: 400);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function updateItem(UpdateCartItemQuantityRequest $request, string $itemId): JsonResponse
    {
        $usuariId = (string) $request->input('auth_user_id');
        if (!$usuariId) {
            return response()->json([
                'success' => false,
                'message' => 'No autenticat',
            ], 401);
        }

        try {
            $validated = $request->validated();

            $this->updateCartItemQuantityCommand->execute(
                usuariId: $usuariId,
                itemId: $itemId,
                quantitat: (int) $validated['quantitat'],
            );

            $cart = $this->getMyCartQuery->execute($usuariId);

            return response()->json([
                'success' => true,
                'message' => 'Quantitat actualitzada correctament',
                'data' => new CartResource($cart),
            ]);
        } catch (CartNotFoundException | CartItemNotFoundException | MerchNotFoundException | InsufficientStockException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], $e->getCode() ?: 400);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function removeItem(Request $request, string $itemId): JsonResponse
    {
        $usuariId = (string) $request->input('auth_user_id');
        if (!$usuariId) {
            return response()->json([
                'success' => false,
                'message' => 'No autenticat',
            ], 401);
        }

        try {
            $this->removeFromCartCommand->execute($usuariId, $itemId);
            $cart = $this->getMyCartQuery->execute($usuariId);

            return response()->json([
                'success' => true,
                'message' => 'Element eliminat del carret',
                'data' => new CartResource($cart),
            ]);
        } catch (CartNotFoundException | CartItemNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], $e->getCode() ?: 400);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function clear(Request $request): JsonResponse
    {
        $usuariId = (string) $request->input('auth_user_id');
        if (!$usuariId) {
            return response()->json([
                'success' => false,
                'message' => 'No autenticat',
            ], 401);
        }

        try {
            $this->clearCartCommand->execute($usuariId);
            $cart = $this->getMyCartQuery->execute($usuariId);

            return response()->json([
                'success' => true,
                'message' => 'Carret buidat correctament',
                'data' => new CartResource($cart),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function createCheckoutSession(CreateCartCheckoutSessionRequest $request): JsonResponse
    {
        $usuariId = (string) $request->input('auth_user_id');
        if (!$usuariId) {
            return response()->json([
                'success' => false,
                'message' => 'No autenticat',
            ], 401);
        }

        try {
            $validated = $request->validated();

            $result = $this->createCartCheckoutSessionCommand->execute(
                usuariId: $usuariId,
                successUrl: $validated['successUrl'],
                cancelUrl: $validated['cancelUrl'],
            );

            return response()->json([
                'success' => true,
                'message' => 'Checkout Stripe creat correctament',
                'data' => [
                    'sessionId' => $result['sessionId'],
                    'checkoutUrl' => $result['checkoutUrl'],
                ],
            ], 201);
        } catch (CartNotFoundException | CartEmptyException | MerchNotFoundException | InsufficientStockException | \DomainException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], $e->getCode() ?: 422);
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

    public function confirmCheckoutSession(Request $request): JsonResponse
    {
        $usuariId = (string) $request->input('auth_user_id');
        if (!$usuariId) {
            return response()->json([
                'success' => false,
                'message' => 'No autenticat',
            ], 401);
        }

        try {
            $validated = $request->validate([
                'sessionId' => 'required|string',
            ]);

            $result = $this->handleMerchStripeWebhookCommand->confirmCheckoutSessionById(
                sessionId: (string) $validated['sessionId'],
                expectedUsuariId: $usuariId,
            );

            $statusCode = $result['status'] === 'error' ? 400 : 200;

            return response()->json([
                'success' => $result['status'] === 'ok',
                'message' => $result['message'],
            ], $statusCode);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function webhook(Request $request): JsonResponse
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');

        if (!$sigHeader) {
            return response()->json([
                'success' => false,
                'message' => 'Falta el header Stripe-Signature',
            ], 400);
        }

        $result = $this->handleMerchStripeWebhookCommand->execute($payload, $sigHeader);
        $statusCode = $result['status'] === 'error' ? 400 : 200;

        return response()->json([
            'success' => $result['status'] === 'ok',
            'message' => $result['message'],
        ], $statusCode);
    }
}
