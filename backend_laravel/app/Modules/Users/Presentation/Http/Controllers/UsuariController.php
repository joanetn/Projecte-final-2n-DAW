<?php

namespace App\Modules\Users\Presentation\Http\Controllers;

// use App\Http\Controllers\Controller;
use App\Modules\Users\Application\Services\UsuariService;
use App\Modules\Users\Domain\DTOs\CreateUsuariDTO;
use App\Modules\Users\Presentation\Http\Requests\StoreUsuariRequest;
use App\Modules\Users\Presentation\Http\Requests\UpdateUsuariRequest;
use App\Modules\Users\Presentation\Http\Resources\UsuariResource;
use Illuminate\Http\JsonResponse;

class UsuariController
{
    public function __construct(
        private UsuariService $usuariService,
    ) {
    }

    public function index(): JsonResponse
    {
        try {
            $usuaris = $this->usuariService->getAllUsuaris();

            return response()->json([
                'success' => true,
                'data' => UsuariResource::collection($usuaris->items()),
                'pagination' => [
                    'total' => $usuaris->total(),
                    'per_page' => $usuaris->perPage(),
                    'current_page' => $usuaris->currentPage(),
                    'last_page' => $usuaris->lastPage(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(string $id): JsonResponse
    {
        try {
            $usuari = $this->usuariService->getUsuariById($id);

            if (!$usuari) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuari no encontrado',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => new UsuariResource($usuari),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(StoreUsuariRequest $request): JsonResponse
    {
        try {
            $dto = CreateUsuariDTO::fromArray($request->validated());
            $usuari = $this->usuariService->createUsuari($dto);

            return response()->json([
                'success' => true,
                'message' => 'Usuari creado correctamente',
                'data' => new UsuariResource($usuari),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function update(UpdateUsuariRequest $request, string $id): JsonResponse
    {
        try {
            $usuari = $this->usuariService->updateUsuari($id, $request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Usuari actualizado correctamente',
                'data' => new UsuariResource($usuari),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $this->usuariService->deleteUsuari($id);

            return response()->json([
                'success' => true,
                'message' => 'Usuari eliminado correctamente',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function deactivate(string $id): JsonResponse
    {
        try {
            $usuari = $this->usuariService->deactivateUsuari($id);

            return response()->json([
                'success' => true,
                'message' => 'Usuari desactivado',
                'data' => new UsuariResource($usuari),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function activate(string $id): JsonResponse
    {
        try {
            $usuari = $this->usuariService->activateUsuari($id);

            return response()->json([
                'success' => true,
                'message' => 'Usuari activado',
                'data' => new UsuariResource($usuari),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }
}
