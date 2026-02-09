<?php

namespace App\Modules\League\Presentation\Http\Controllers;

use App\Modules\League\Application\Commands\CreateStandingCommand;
use App\Modules\League\Application\Commands\DestroyStandingCommand;
use App\Modules\League\Application\Commands\UpdateStandingCommand;
use App\Modules\League\Application\DTOs\CreateStandingDTO;
use App\Modules\League\Application\DTOs\UpdateStandingDTO;
use App\Modules\League\Application\Queries\GetStandingQuery;
use App\Modules\League\Application\Queries\GetStandingsDetailQuery;
use App\Modules\League\Application\Queries\GetStandingsQuery;
use App\Modules\League\Domain\Exceptions\InvalidStandingException;
use App\Modules\League\Domain\Exceptions\StandingNotFoundException;
use App\Modules\League\Presentation\Http\Requests\CreateStandingRequest;
use App\Modules\League\Presentation\Http\Requests\UpdateStandingRequest;
use App\Modules\League\Presentation\Http\Resources\StandingDetailResource;
use App\Modules\League\Presentation\Http\Resources\StandingResource;
use Illuminate\Routing\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;

class StandingController extends Controller
{
    public function __construct(
        private CreateStandingCommand $createStandingCommand,
        private UpdateStandingCommand $updateStandingCommand,
        private DestroyStandingCommand $destroyStandingCommand,
        private GetStandingQuery $getStandingQuery,
        private GetStandingsQuery $getStandingsQuery,
        private GetStandingsDetailQuery $getStandingsDetailQuery
    ) {}

    public function index(): JsonResponse
    {
        $standings = $this->getStandingsQuery->execute();

        return response()->json([
            'success' => true,
            'data' => StandingResource::collection($standings)
        ]);
    }

    public function show(string $id): JsonResponse
    {
        try {
            $standing = $this->getStandingQuery->execute(standingId: $id);

            return response()->json([
                'success' => true,
                'data' => new StandingResource($standing)
            ]);
        } catch (StandingNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        }
    }

    public function showDetail(string $id): JsonResponse
    {
        try {
            $standing = $this->getStandingsDetailQuery->execute(standingId: $id);

            return response()->json([
                'success' => true,
                'data' => new StandingDetailResource($standing)
            ]);
        } catch (StandingNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        }
    }

    public function store(CreateStandingRequest $request): JsonResponse
    {
        try {
            $dto = CreateStandingDTO::fromArray($request->validated());

            $standingId = $this->createStandingCommand->execute($dto);

            return response()->json([
                'success' => true,
                'message' => 'Classificació creada correctament',
                'data' => ['id' => $standingId]
            ], 201);
        } catch (InvalidStandingException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear la classificació'
            ], 400);
        }
    }

    public function update(UpdateStandingRequest $request, string $id): JsonResponse
    {
        try {
            $dto = UpdateStandingDTO::fromArray($request->validated());

            $this->updateStandingCommand->execute($id, $dto);

            return response()->json([
                'success' => true,
                'message' => 'Classificació actualitzada correctament'
            ]);
        } catch (StandingNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        } catch (InvalidStandingException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage() ?? 'Error al actualitzar la classificació'
            ], 400);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $this->destroyStandingCommand->execute($id);

            return response()->json([
                'success' => true,
                'message' => 'Classificació eliminada correctament'
            ]);
        } catch (StandingNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage() ?? 'Error al eliminar la classificació'
            ], 400);
        }
    }
}
