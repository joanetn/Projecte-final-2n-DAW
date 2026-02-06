<?php

namespace App\Modules\Match\Presentation\Http\Controllers;

use App\Modules\Match\Application\Commands\AssignArbitreCommand;
use App\Modules\Match\Application\Commands\CreateMatchCommand;
use App\Modules\Match\Application\Commands\UpdateMatchCommand;
use App\Modules\Match\Application\Commands\DestroyMatchCommand;
use App\Modules\Match\Application\DTOs\CreateMatchDTO;
use App\Modules\Match\Application\DTOs\UpdateMatchDTO;
use App\Modules\Match\Application\Queries\GetMatchesDetailQuery;
use App\Modules\Match\Application\Queries\GetMatchesQuery;
use App\Modules\Match\Application\Queries\GetMatchQuery;
use App\Modules\Match\Domain\Exceptions\MatchNotFoundException;
use App\Modules\Match\Domain\Exceptions\InvalidMatchDateException;
use App\Modules\Match\Presentation\Http\Requests\CreateMatchRequest;
use App\Modules\Match\Presentation\Http\Requests\UpdateMatchRequest;
use App\Modules\Match\Presentation\Http\Resources\MatchResource;
use App\Modules\Match\Presentation\Http\Resources\MatchDetailResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class MatchController extends Controller
{
    public function __construct(
        private CreateMatchCommand $createMatchCommand,
        private UpdateMatchCommand $updateMatchCommand,
        private DestroyMatchCommand $destroyMatchCommand,
        private AssignArbitreCommand $assignArbitreCommand,
        private GetMatchQuery $getMatchQuery,
        private GetMatchesQuery $getMatchesQuery,
        private GetMatchesDetailQuery $getMatchesDetailQuery
    ) {}

    public function index(): JsonResponse
    {
        $matches = $this->getMatchesQuery->execute();

        return response()->json([
            'success' => true,
            'data' => MatchResource::collection($matches)
        ]);
    }

    public function show(string $id): JsonResponse
    {
        try {
            $match = $this->getMatchQuery->execute($id);

            return response()->json([
                'success' => true,
                'data' => new MatchResource($match)
            ]);
        } catch (MatchNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        }
    }

    public function showDetail(string $id): JsonResponse
    {
        try {
            $match = $this->getMatchesDetailQuery->execute($id);

            return response()->json([
                'success' => true,
                'data' => new MatchDetailResource($match)
            ]);
        } catch (MatchNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        }
    }

    public function store(CreateMatchRequest $request): JsonResponse
    {
        try {
            $dto = CreateMatchDTO::fromArray($request->validated());
            $matchId = $this->createMatchCommand->execute($dto);

            return response()->json([
                'success' => true,
                'message' => 'Partit creat correctament',
                'data' => ['id' => $matchId]
            ], 201);
        } catch (InvalidMatchDateException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el partit'
            ], $e->getCode());
        }
    }

    public function update(UpdateMatchRequest $request, string $id): JsonResponse
    {
        try {
            $dto = UpdateMatchDTO::fromArray($request->validated());
            $this->updateMatchCommand->execute($id, $dto);

            return response()->json([
                'success' => true,
                'message' => 'Partit actualitzat correctament'
            ]);
        } catch (MatchNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        } catch (InvalidMatchDateException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualitzar el partit'
            ], $e->getCode());
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $this->destroyMatchCommand->execute($id);

            return response()->json([
                'success' => true,
                'message' => 'Partit eliminat correctament'
            ]);
        } catch (MatchNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage() ?? 'Error al eliminar el partit'
            ], 400);
        }
    }

    public function assignArbitre(Request $request, string $id): JsonResponse
    {
        try {
            $request->validate([
                'arbitreId' => 'required|string|exists:usuaris,id'
            ]);

            $this->assignArbitreCommand->execute($id, $request->arbitreId);

            return response()->json([
                'success' => true,
                'message' => 'Àrbitre assignat correctament'
            ]);
        } catch (MatchNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        } catch (InvalidMatchDateException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualitzar el partit'
            ], $e->getCode());
        }
    }
}
