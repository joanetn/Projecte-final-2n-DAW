<?php

namespace App\Modules\League\Presentation\Http\Controllers;

use App\Modules\League\Application\Commands\CreateRoundCommand;
use App\Modules\League\Application\Commands\DestroyRoundCommand;
use App\Modules\League\Application\Commands\UpdateRoundCommand;
use App\Modules\League\Application\DTOs\CreateRoundDTO;
use App\Modules\League\Application\DTOs\UpdateRoundDTO;
use App\Modules\League\Application\Queries\GetRoundQuery;
use App\Modules\League\Application\Queries\GetRoundsDetailQuery;
use App\Modules\League\Application\Queries\GetRoundsQuery;
use App\Modules\League\Domain\Exceptions\InvalidRoundDateException;
use App\Modules\League\Domain\Exceptions\RoundNotFoundException;
use App\Modules\League\Presentation\Http\Requests\CreateRoundRequest;
use App\Modules\League\Presentation\Http\Requests\UpdateRoundRequest;
use App\Modules\League\Presentation\Http\Resources\RoundDetailResource;
use App\Modules\League\Presentation\Http\Resources\RoundResource;
use Illuminate\Routing\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;

class RoundController extends Controller
{
    public function __construct(
        private CreateRoundCommand $createRoundCommand,
        private UpdateRoundCommand $updateRoundCommand,
        private DestroyRoundCommand $destroyRoundCommand,
        private GetRoundQuery $getRoundQuery,
        private GetRoundsQuery $getRoundsQuery,
        private GetRoundsDetailQuery $getRoundsDetailQuery
    ) {}

    public function index(): JsonResponse
    {
        $rounds = $this->getRoundsQuery->execute();

        return response()->json([
            'success' => true,
            'data' => RoundResource::collection($rounds)
        ]);
    }

    public function show(string $id): JsonResponse
    {
        try {
            $round = $this->getRoundQuery->execute(roundId: $id);

            return response()->json([
                'success' => true,
                'data' => new RoundResource($round)
            ]);
        } catch (RoundNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        }
    }

    public function showDetail(string $id): JsonResponse
    {
        try {
            $round = $this->getRoundsDetailQuery->execute(roundId: $id);

            return response()->json([
                'success' => true,
                'data' => new RoundDetailResource($round)
            ]);
        } catch (RoundNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        }
    }

    public function store(CreateRoundRequest $request): JsonResponse
    {
        try {
            $dto = CreateRoundDTO::fromArray($request->validated());

            $roundId = $this->createRoundCommand->execute($dto);

            return response()->json([
                'success' => true,
                'message' => 'Jornada creada correctament',
                'data' => ['id' => $roundId]
            ], 201);
        } catch (InvalidRoundDateException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear la jornada'
            ], 400);
        }
    }

    public function update(UpdateRoundRequest $request, string $id): JsonResponse
    {
        try {
            $dto = UpdateRoundDTO::fromArray($request->validated());

            $this->updateRoundCommand->execute($id, $dto);

            return response()->json([
                'success' => true,
                'message' => 'Jornada actualitzada correctament'
            ]);
        } catch (RoundNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        } catch (InvalidRoundDateException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage() ?? 'Error al actualitzar la jornada'
            ], 400);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $this->destroyRoundCommand->execute($id);

            return response()->json([
                'success' => true,
                'message' => 'Jornada eliminada correctament'
            ]);
        } catch (RoundNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage() ?? 'Error al eliminar la jornada'
            ], 400);
        }
    }
}
