<?php

namespace App\Modules\Match\Presentation\Http\Controllers;

use App\Modules\Match\Application\Commands\CreateMatchCommand;
use App\Modules\Match\Application\Commands\UpdateMatchAdminCommand;
use App\Modules\Match\Application\Commands\DestroyMatchAdminCommand;
use App\Modules\Match\Application\DTOs\CreateMatchDTO;
use App\Modules\Match\Application\DTOs\UpdateMatchDTO;
use App\Modules\Match\Application\Queries\GetMatchAdminQuery;
use App\Modules\Match\Application\Queries\GetMatchesAdminQuery;
use App\Modules\Match\Application\Queries\GetMatchDetailAdminQuery;
use App\Modules\Match\Domain\Exceptions\MatchNotFoundException;
use App\Modules\Match\Domain\Exceptions\InvalidMatchDateException;
use App\Modules\Match\Presentation\Http\Requests\CreateMatchRequest;
use App\Modules\Match\Presentation\Http\Requests\UpdateMatchRequest;
use App\Modules\Match\Presentation\Http\Resources\MatchResource;
use App\Modules\Match\Presentation\Http\Resources\MatchDetailResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class AdminMatchController extends Controller
{
    public function __construct(
        private CreateMatchCommand $createMatchCommand,
        private UpdateMatchAdminCommand $updateMatchCommand,
        private DestroyMatchAdminCommand $destroyMatchCommand,
        private GetMatchAdminQuery $getMatchQuery,
        private GetMatchesAdminQuery $getMatchesQuery,
        private GetMatchDetailAdminQuery $getMatchDetailQuery,
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
            $match = $this->getMatchDetailQuery->execute($id);

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
                'message' => $e->getMessage()
            ], 400);
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
                'message' => $e->getMessage()
            ], 400);
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
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
