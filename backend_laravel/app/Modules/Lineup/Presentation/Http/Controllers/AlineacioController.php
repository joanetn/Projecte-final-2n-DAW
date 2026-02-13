<?php

/**
 * Controller d'Alineacions (Lineup).
 *
 * Gestiona les peticions HTTP per al CRUD d'alineacions.
 * Rep les peticions, delega la lògica als Commands/Queries
 * i retorna respostes JSON estandarditzades.
 * Segueix el patró CQRS: Commands per escriptura, Queries per lectura.
 */

namespace App\Modules\Lineup\Presentation\Http\Controllers;

use App\Modules\Lineup\Application\Commands\CreateAlineacioCommand;
use App\Modules\Lineup\Application\Commands\UpdateAlineacioCommand;
use App\Modules\Lineup\Application\Commands\DestroyAlineacioCommand;
use App\Modules\Lineup\Application\DTOs\CreateAlineacioDTO;
use App\Modules\Lineup\Application\DTOs\UpdateAlineacioDTO;
use App\Modules\Lineup\Application\Queries\GetAlineacionsQuery;
use App\Modules\Lineup\Application\Queries\GetAlineacioQuery;
use App\Modules\Lineup\Application\Queries\GetAlineacionsByPartitQuery;
use App\Modules\Lineup\Domain\Exceptions\AlineacioNotFoundException;
use App\Modules\Lineup\Domain\Exceptions\DuplicateAlineacioException;
use App\Modules\Lineup\Presentation\Http\Requests\CreateAlineacioRequest;
use App\Modules\Lineup\Presentation\Http\Requests\UpdateAlineacioRequest;
use App\Modules\Lineup\Presentation\Http\Resources\AlineacioResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class AlineacioController extends Controller
{
    public function __construct(
        private CreateAlineacioCommand $createCommand,
        private UpdateAlineacioCommand $updateCommand,
        private DestroyAlineacioCommand $destroyCommand,
        private GetAlineacionsQuery $getAlineacionsQuery,
        private GetAlineacioQuery $getAlineacioQuery,
        private GetAlineacionsByPartitQuery $getByPartitQuery
    ) {}

    /**
     * GET /alineacions - Retorna totes les alineacions actives.
     */
    public function index(): JsonResponse
    {
        $alineacions = $this->getAlineacionsQuery->execute();

        return response()->json([
            'success' => true,
            'data' => AlineacioResource::collection($alineacions)
        ]);
    }

    /**
     * GET /alineacions/{id} - Retorna una alineació per ID.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $alineacio = $this->getAlineacioQuery->execute(alineacioId: $id);

            return response()->json([
                'success' => true,
                'data' => new AlineacioResource($alineacio)
            ]);
        } catch (AlineacioNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        }
    }

    /**
     * GET /alineacions/partit/{partitId} - Retorna les alineacions d'un partit.
     */
    public function byPartit(string $partitId): JsonResponse
    {
        $alineacions = $this->getByPartitQuery->execute($partitId);

        return response()->json([
            'success' => true,
            'data' => AlineacioResource::collection($alineacions)
        ]);
    }

    /**
     * POST /alineacions - Crea una nova alineació.
     */
    public function store(CreateAlineacioRequest $request): JsonResponse
    {
        try {
            $dto = CreateAlineacioDTO::fromArray($request->validated());
            $alineacioId = $this->createCommand->execute($dto);

            return response()->json([
                'success' => true,
                'message' => 'Alineació creada correctament',
                'data' => ['id' => $alineacioId]
            ], 201);
        } catch (DuplicateAlineacioException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => "Error al crear l'alineació"
            ], 500);
        }
    }

    /**
     * PUT /alineacions/{id} - Actualitza una alineació existent.
     */
    public function update(UpdateAlineacioRequest $request, string $id): JsonResponse
    {
        try {
            $dto = UpdateAlineacioDTO::fromArray($request->validated());
            $this->updateCommand->execute($id, $dto);

            return response()->json([
                'success' => true,
                'message' => 'Alineació actualitzada correctament'
            ]);
        } catch (AlineacioNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => "Error al actualitzar l'alineació"
            ], 500);
        }
    }

    /**
     * DELETE /alineacions/{id} - Elimina (soft delete) una alineació.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $this->destroyCommand->execute($id);

            return response()->json([
                'success' => true,
                'message' => 'Alineació eliminada correctament'
            ]);
        } catch (AlineacioNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => "Error al eliminar l'alineació"
            ], 500);
        }
    }
}
