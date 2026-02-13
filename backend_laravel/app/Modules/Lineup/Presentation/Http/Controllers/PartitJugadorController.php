<?php

/**
 * Controller de PartitJugadors (Jugadors per Partit).
 *
 * Gestiona les peticions HTTP per al CRUD de jugadors assignats a partits.
 * Permet afegir, treure i consultar jugadors d'un partit.
 * Segueix el patró CQRS: Commands per escriptura, Queries per lectura.
 */

namespace App\Modules\Lineup\Presentation\Http\Controllers;

use App\Modules\Lineup\Application\Commands\CreatePartitJugadorCommand;
use App\Modules\Lineup\Application\Commands\UpdatePartitJugadorCommand;
use App\Modules\Lineup\Application\Commands\DestroyPartitJugadorCommand;
use App\Modules\Lineup\Application\DTOs\CreatePartitJugadorDTO;
use App\Modules\Lineup\Application\DTOs\UpdatePartitJugadorDTO;
use App\Modules\Lineup\Application\Queries\GetPartitJugadorsQuery;
use App\Modules\Lineup\Application\Queries\GetPartitJugadorQuery;
use App\Modules\Lineup\Application\Queries\GetPartitJugadorsByPartitQuery;
use App\Modules\Lineup\Domain\Exceptions\PartitJugadorNotFoundException;
use App\Modules\Lineup\Presentation\Http\Requests\CreatePartitJugadorRequest;
use App\Modules\Lineup\Presentation\Http\Requests\UpdatePartitJugadorRequest;
use App\Modules\Lineup\Presentation\Http\Resources\PartitJugadorResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class PartitJugadorController extends Controller
{
    public function __construct(
        private CreatePartitJugadorCommand $createCommand,
        private UpdatePartitJugadorCommand $updateCommand,
        private DestroyPartitJugadorCommand $destroyCommand,
        private GetPartitJugadorsQuery $getPartitJugadorsQuery,
        private GetPartitJugadorQuery $getPartitJugadorQuery,
        private GetPartitJugadorsByPartitQuery $getByPartitQuery
    ) {}

    /**
     * GET /partit-jugadors - Retorna tots els registres actius de jugadors en partits.
     */
    public function index(): JsonResponse
    {
        $partitJugadors = $this->getPartitJugadorsQuery->execute();

        return response()->json([
            'success' => true,
            'data' => PartitJugadorResource::collection($partitJugadors)
        ]);
    }

    /**
     * GET /partit-jugadors/{id} - Retorna un registre per ID.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $partitJugador = $this->getPartitJugadorQuery->execute(partitJugadorId: $id);

            return response()->json([
                'success' => true,
                'data' => new PartitJugadorResource($partitJugador)
            ]);
        } catch (PartitJugadorNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        }
    }

    /**
     * GET /partit-jugadors/partit/{partitId} - Retorna els jugadors d'un partit.
     */
    public function byPartit(string $partitId): JsonResponse
    {
        $partitJugadors = $this->getByPartitQuery->execute($partitId);

        return response()->json([
            'success' => true,
            'data' => PartitJugadorResource::collection($partitJugadors)
        ]);
    }

    /**
     * POST /partit-jugadors - Crea un nou registre de jugador en un partit.
     */
    public function store(CreatePartitJugadorRequest $request): JsonResponse
    {
        try {
            $dto = CreatePartitJugadorDTO::fromArray($request->validated());
            $partitJugadorId = $this->createCommand->execute($dto);

            return response()->json([
                'success' => true,
                'message' => 'Jugador afegit al partit correctament',
                'data' => ['id' => $partitJugadorId]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al afegir el jugador al partit'
            ], 500);
        }
    }

    /**
     * PUT /partit-jugadors/{id} - Actualitza un registre existent.
     */
    public function update(UpdatePartitJugadorRequest $request, string $id): JsonResponse
    {
        try {
            $dto = UpdatePartitJugadorDTO::fromArray($request->validated());
            $this->updateCommand->execute($id, $dto);

            return response()->json([
                'success' => true,
                'message' => 'Jugador de partit actualitzat correctament'
            ]);
        } catch (PartitJugadorNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualitzar el jugador de partit'
            ], 500);
        }
    }

    /**
     * DELETE /partit-jugadors/{id} - Elimina (soft delete) un registre.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $this->destroyCommand->execute($id);

            return response()->json([
                'success' => true,
                'message' => 'Jugador de partit eliminat correctament'
            ]);
        } catch (PartitJugadorNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el jugador de partit'
            ], 500);
        }
    }
}
