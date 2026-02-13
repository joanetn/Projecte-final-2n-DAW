<?php

namespace App\Modules\Venue\Presentation\Http\Controllers;

use App\Modules\Venue\Application\Commands\CreateInstalacioCommand;
use App\Modules\Venue\Application\Commands\UpdateInstalacioCommand;
use App\Modules\Venue\Application\Commands\DestroyInstalacioCommand;
use App\Modules\Venue\Application\Commands\CreatePistaCommand;
use App\Modules\Venue\Application\Commands\UpdatePistaCommand;
use App\Modules\Venue\Application\Commands\DestroyPistaCommand;
use App\Modules\Venue\Application\DTOs\CreateInstalacioDTO;
use App\Modules\Venue\Application\DTOs\UpdateInstalacioDTO;
use App\Modules\Venue\Application\DTOs\CreatePistaDTO;
use App\Modules\Venue\Application\DTOs\UpdatePistaDTO;
use App\Modules\Venue\Application\Queries\GetInstalacionsQuery;
use App\Modules\Venue\Application\Queries\GetInstalacioQuery;
use App\Modules\Venue\Application\Queries\GetPistesByInstalacioQuery;
use App\Modules\Venue\Application\Queries\GetPistaQuery;
use App\Modules\Venue\Domain\Exceptions\InstalacioNotFoundException;
use App\Modules\Venue\Domain\Exceptions\PistaNotFoundException;
use App\Modules\Venue\Presentation\Http\Requests\CreateInstalacioRequest;
use App\Modules\Venue\Presentation\Http\Requests\UpdateInstalacioRequest;
use App\Modules\Venue\Presentation\Http\Requests\CreatePistaRequest;
use App\Modules\Venue\Presentation\Http\Requests\UpdatePistaRequest;
use App\Modules\Venue\Presentation\Http\Resources\InstalacioResource;
use App\Modules\Venue\Presentation\Http\Resources\PistaResource;

use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class VenueController extends Controller
{
    public function __construct(
        private CreateInstalacioCommand $createInstalacioCommand,
        private UpdateInstalacioCommand $updateInstalacioCommand,
        private DestroyInstalacioCommand $destroyInstalacioCommand,
        private CreatePistaCommand $createPistaCommand,
        private UpdatePistaCommand $updatePistaCommand,
        private DestroyPistaCommand $destroyPistaCommand,
        private GetInstalacionsQuery $getInstalacionsQuery,
        private GetInstalacioQuery $getInstalacioQuery,
        private GetPistesByInstalacioQuery $getPistesByInstalacioQuery,
        private GetPistaQuery $getPistaQuery,
    ) {}

    public function index(): JsonResponse
    {
        $instalacions = $this->getInstalacionsQuery->execute();

        return response()->json([
            'success' => true,
            'data' => InstalacioResource::collection($instalacions)
        ]);
    }

    public function show(string $id): JsonResponse
    {
        try {
            $instalacio = $this->getInstalacioQuery->execute($id);

            return response()->json([
                'success' => true,
                'data' => new InstalacioResource($instalacio)
            ]);
        } catch (InstalacioNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        }
    }

    public function store(CreateInstalacioRequest $request): JsonResponse
    {
        try {
            $dto = CreateInstalacioDTO::fromArray($request->validated());
            $instalacioId = $this->createInstalacioCommand->execute($dto);

            return response()->json([
                'success' => true,
                'message' => 'Instal·lació creada correctament',
                'data' => ['id' => $instalacioId]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'exception' => get_class($e),
                'debug' => env('APP_DEBUG')
            ], 400);
        }
    }

    public function update(UpdateInstalacioRequest $request, string $id): JsonResponse
    {
        try {
            $dto = UpdateInstalacioDTO::fromArray($request->validated());
            $this->updateInstalacioCommand->execute($id, $dto);

            return response()->json([
                'success' => true,
                'message' => 'Instal·lació actualitzada correctament'
            ]);
        } catch (InstalacioNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'exception' => get_class($e),
                'debug' => env('APP_DEBUG')
            ], 400);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $this->destroyInstalacioCommand->execute($id);

            return response()->json([
                'success' => true,
                'message' => 'Instal·lació eliminada correctament'
            ]);
        } catch (InstalacioNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'exception' => get_class($e),
                'debug' => env('APP_DEBUG')
            ], 400);
        }
    }

    public function indexPistes(string $instalacioId): JsonResponse
    {
        try {
            $pistes = $this->getPistesByInstalacioQuery->execute($instalacioId);

            return response()->json([
                'success' => true,
                'data' => PistaResource::collection($pistes)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'exception' => get_class($e),
                'debug' => env('APP_DEBUG')
            ], 400);
        }
    }

    public function showPista(string $instalacioId, string $pistaId): JsonResponse
    {
        try {
            $pista = $this->getPistaQuery->execute($pistaId);

            return response()->json([
                'success' => true,
                'data' => new PistaResource($pista)
            ]);
        } catch (PistaNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        }
    }

    public function storePista(string $instalacioId, CreatePistaRequest $request): JsonResponse
    {
        try {
            $dto = CreatePistaDTO::fromArray(array_merge(
                $request->validated(),
                ['instalacioId' => $instalacioId]
            ));
            $pistaId = $this->createPistaCommand->execute($dto);

            return response()->json([
                'success' => true,
                'message' => 'Pista creada correctament',
                'data' => ['id' => $pistaId]
            ], 201);
        } catch (InstalacioNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'exception' => get_class($e),
                'debug' => env('APP_DEBUG')
            ], 400);
        }
    }

    public function updatePista(string $instalacioId, string $pistaId, UpdatePistaRequest $request): JsonResponse
    {
        try {
            $dto = UpdatePistaDTO::fromArray($request->validated());
            $this->updatePistaCommand->execute($pistaId, $instalacioId, $dto);

            return response()->json([
                'success' => true,
                'message' => 'Pista actualitzada correctament'
            ]);
        } catch (PistaNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'exception' => get_class($e),
                'debug' => env('APP_DEBUG')
            ], 400);
        }
    }

    public function destroyPista(string $instalacioId, string $pistaId): JsonResponse
    {
        try {
            $this->destroyPistaCommand->execute($pistaId, $instalacioId);

            return response()->json([
                'success' => true,
                'message' => 'Pista eliminada correctament'
            ]);
        } catch (PistaNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'exception' => get_class($e),
                'debug' => env('APP_DEBUG')
            ], 400);
        }
    }
}
