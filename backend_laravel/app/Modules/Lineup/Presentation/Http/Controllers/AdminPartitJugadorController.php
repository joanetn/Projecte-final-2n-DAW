<?php

namespace App\Modules\Lineup\Presentation\Http\Controllers;

use App\Modules\Lineup\Application\Commands\CreatePartitJugadorCommand;
use App\Modules\Lineup\Application\Commands\UpdatePartitJugadorAdminCommand;
use App\Modules\Lineup\Application\Commands\DestroyPartitJugadorAdminCommand;
use App\Modules\Lineup\Application\DTOs\CreatePartitJugadorDTO;
use App\Modules\Lineup\Application\DTOs\UpdatePartitJugadorDTO;
use App\Modules\Lineup\Application\Queries\GetPartitJugadorsAdminQuery;
use App\Modules\Lineup\Application\Queries\GetPartitJugadorAdminQuery;
use App\Modules\Lineup\Domain\Exceptions\PartitJugadorNotFoundException;
use App\Modules\Lineup\Presentation\Http\Requests\CreatePartitJugadorRequest;
use App\Modules\Lineup\Presentation\Http\Requests\UpdatePartitJugadorRequest;
use App\Modules\Lineup\Presentation\Http\Resources\PartitJugadorResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class AdminPartitJugadorController extends Controller
{
    public function __construct(
        private CreatePartitJugadorCommand $createCommand,
        private UpdatePartitJugadorAdminCommand $updateCommand,
        private DestroyPartitJugadorAdminCommand $destroyCommand,
        private GetPartitJugadorsAdminQuery $getPartitJugadorsQuery,
        private GetPartitJugadorAdminQuery $getPartitJugadorQuery,
    ) {}

    public function index(): JsonResponse
    {
        $partitJugadors = $this->getPartitJugadorsQuery->execute();

        return response()->json([
            'success' => true,
            'data' => PartitJugadorResource::collection($partitJugadors)
        ]);
    }

    public function show(string $id): JsonResponse
    {
        try {
            $partitJugador = $this->getPartitJugadorQuery->execute($id);

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
                'message' => $e->getMessage()
            ], 400);
        }
    }

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
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
