<?php

namespace App\Modules\Lineup\Presentation\Http\Controllers;

use App\Modules\Lineup\Application\Commands\CreatePuntuacioCommand;
use App\Modules\Lineup\Application\Commands\UpdatePuntuacioAdminCommand;
use App\Modules\Lineup\Application\Commands\DestroyPuntuacioAdminCommand;
use App\Modules\Lineup\Application\DTOs\CreatePuntuacioDTO;
use App\Modules\Lineup\Application\DTOs\UpdatePuntuacioDTO;
use App\Modules\Lineup\Application\Queries\GetPuntuacionsAdminQuery;
use App\Modules\Lineup\Application\Queries\GetPuntuacioAdminQuery;
use App\Modules\Lineup\Domain\Exceptions\PuntuacioNotFoundException;
use App\Modules\Lineup\Domain\Exceptions\InvalidPuntuacioException;
use App\Modules\Lineup\Presentation\Http\Requests\CreatePuntuacioRequest;
use App\Modules\Lineup\Presentation\Http\Requests\UpdatePuntuacioRequest;
use App\Modules\Lineup\Presentation\Http\Resources\PuntuacioResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class AdminPuntuacioController extends Controller
{
    public function __construct(
        private CreatePuntuacioCommand $createCommand,
        private UpdatePuntuacioAdminCommand $updateCommand,
        private DestroyPuntuacioAdminCommand $destroyCommand,
        private GetPuntuacionsAdminQuery $getPuntuacionsQuery,
        private GetPuntuacioAdminQuery $getPuntuacioQuery,
    ) {}

    public function index(): JsonResponse
    {
        $puntuacions = $this->getPuntuacionsQuery->execute();

        return response()->json([
            'success' => true,
            'data' => PuntuacioResource::collection($puntuacions)
        ]);
    }

    public function show(string $id): JsonResponse
    {
        try {
            $puntuacio = $this->getPuntuacioQuery->execute($id);

            return response()->json([
                'success' => true,
                'data' => new PuntuacioResource($puntuacio)
            ]);
        } catch (PuntuacioNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        }
    }

    public function store(CreatePuntuacioRequest $request): JsonResponse
    {
        try {
            $dto = CreatePuntuacioDTO::fromArray($request->validated());
            $puntuacioId = $this->createCommand->execute($dto);

            return response()->json([
                'success' => true,
                'message' => 'Puntuació creada correctament',
                'data' => ['id' => $puntuacioId]
            ], 201);
        } catch (InvalidPuntuacioException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function update(UpdatePuntuacioRequest $request, string $id): JsonResponse
    {
        try {
            $dto = UpdatePuntuacioDTO::fromArray($request->validated());
            $this->updateCommand->execute($id, $dto);

            return response()->json([
                'success' => true,
                'message' => 'Puntuació actualitzada correctament'
            ]);
        } catch (PuntuacioNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        } catch (InvalidPuntuacioException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $this->destroyCommand->execute($id);

            return response()->json([
                'success' => true,
                'message' => 'Puntuació eliminada correctament'
            ]);
        } catch (PuntuacioNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
