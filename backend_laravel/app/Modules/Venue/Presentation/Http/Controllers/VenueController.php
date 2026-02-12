<?php

/**
 * Controlador del mòdul Venue.
 *
 * Gestiona totes les peticions HTTP per a instal·lacions i pistes esportives.
 * Segueix el patró CQRS: Commands per escriure, Queries per llegir.
 * Laravel injecta automàticament totes les dependències al constructor
 * gràcies al Service Container.
 *
 * Rutes gestionades:
 *   GET    /instalacions                           → index()
 *   GET    /instalacions/{id}                      → show()
 *   POST   /instalacions                           → store()
 *   PUT    /instalacions/{id}                      → update()
 *   DELETE /instalacions/{id}                      → destroy()
 *   GET    /instalacions/{id}/pistes              → indexPistes()
 *   GET    /instalacions/{id}/pistes/{pistaId}    → showPista()
 *   POST   /instalacions/{id}/pistes              → storePista()
 *   PUT    /instalacions/{id}/pistes/{pistaId}    → updatePista()
 *   DELETE /instalacions/{id}/pistes/{pistaId}    → destroyPista()
 */

namespace App\Modules\Venue\Presentation\Http\Controllers;

// --- Commands: classes que executen accions d'escriptura (crear, actualitzar, eliminar) ---
use App\Modules\Venue\Application\Commands\CreateInstalacioCommand;
use App\Modules\Venue\Application\Commands\UpdateInstalacioCommand;
use App\Modules\Venue\Application\Commands\DestroyInstalacioCommand;
use App\Modules\Venue\Application\Commands\CreatePistaCommand;
use App\Modules\Venue\Application\Commands\UpdatePistaCommand;
use App\Modules\Venue\Application\Commands\DestroyPistaCommand;

// --- DTOs: objectes que transporten les dades entre capes ---
use App\Modules\Venue\Application\DTOs\CreateInstalacioDTO;
use App\Modules\Venue\Application\DTOs\UpdateInstalacioDTO;
use App\Modules\Venue\Application\DTOs\CreatePistaDTO;
use App\Modules\Venue\Application\DTOs\UpdatePistaDTO;

// --- Queries: classes que executen consultes de lectura ---
use App\Modules\Venue\Application\Queries\GetInstalacionsQuery;
use App\Modules\Venue\Application\Queries\GetInstalacioQuery;
use App\Modules\Venue\Application\Queries\GetPistesByInstalacioQuery;
use App\Modules\Venue\Application\Queries\GetPistaQuery;

// --- Excepcions de domini ---
use App\Modules\Venue\Domain\Exceptions\InstalacioNotFoundException;
use App\Modules\Venue\Domain\Exceptions\PistaNotFoundException;

// --- Requests de validació ---
use App\Modules\Venue\Presentation\Http\Requests\CreateInstalacioRequest;
use App\Modules\Venue\Presentation\Http\Requests\UpdateInstalacioRequest;
use App\Modules\Venue\Presentation\Http\Requests\CreatePistaRequest;
use App\Modules\Venue\Presentation\Http\Requests\UpdatePistaRequest;

// --- Resources per formatejar la resposta JSON ---
use App\Modules\Venue\Presentation\Http\Resources\InstalacioResource;
use App\Modules\Venue\Presentation\Http\Resources\PistaResource;

use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class VenueController extends Controller
{
    public function __construct(
        // Commands d'Instal·lació
        private CreateInstalacioCommand $createInstalacioCommand,
        private UpdateInstalacioCommand $updateInstalacioCommand,
        private DestroyInstalacioCommand $destroyInstalacioCommand,
        // Commands de Pista
        private CreatePistaCommand $createPistaCommand,
        private UpdatePistaCommand $updatePistaCommand,
        private DestroyPistaCommand $destroyPistaCommand,
        // Queries
        private GetInstalacionsQuery $getInstalacionsQuery,
        private GetInstalacioQuery $getInstalacioQuery,
        private GetPistesByInstalacioQuery $getPistesByInstalacioQuery,
        private GetPistaQuery $getPistaQuery,
    ) {}

    // =====================================================================
    // INSTAL·LACIÓ ENDPOINTS
    // =====================================================================

    /**
     * GET /instalacions - Llistar totes les instal·lacions actives
     */
    public function index(): JsonResponse
    {
        $instalacions = $this->getInstalacionsQuery->execute();

        return response()->json([
            'success' => true,
            'data' => InstalacioResource::collection($instalacions)
        ]);
    }

    /**
     * GET /instalacions/{id} - Obtenir una instal·lació per ID amb les seves pistes
     */
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

    /**
     * POST /instalacions - Crear una nova instal·lació
     */
    public function store(CreateInstalacioRequest $request): JsonResponse
    {
        try {
            // Convertim les dades validades a un DTO
            $dto = CreateInstalacioDTO::fromArray($request->validated());
            // Executem el command que crea la instal·lació
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

    /**
     * PUT /instalacions/{id} - Actualitzar una instal·lació
     */
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

    /**
     * DELETE /instalacions/{id} - Eliminar (soft delete) una instal·lació
     */
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

    // =====================================================================
    // PISTA ENDPOINTS (dins d'una instal·lació)
    // =====================================================================

    /**
     * GET /instalacions/{instalacioId}/pistes - Llistar pistes d'una instal·lació
     */
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

    /**
     * GET /instalacions/{instalacioId}/pistes/{pistaId} - Obtenir una pista concreta
     */
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

    /**
     * POST /instalacions/{instalacioId}/pistes - Crear una pista dins d'una instal·lació
     */
    public function storePista(string $instalacioId, CreatePistaRequest $request): JsonResponse
    {
        try {
            // Afegim l'instalacioId de la ruta a les dades validades
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

    /**
     * PUT /instalacions/{instalacioId}/pistes/{pistaId} - Actualitzar una pista
     */
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

    /**
     * DELETE /instalacions/{instalacioId}/pistes/{pistaId} - Eliminar una pista
     */
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
