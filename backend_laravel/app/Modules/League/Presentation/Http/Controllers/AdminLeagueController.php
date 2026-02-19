<?php

namespace App\Modules\League\Presentation\Http\Controllers;

use App\Modules\League\Application\Commands\CreateLeagueCommand;
use App\Modules\League\Application\Commands\UpdateLeagueAdminCommand;
use App\Modules\League\Application\Commands\DestroyLeagueAdminCommand;
use App\Modules\League\Application\DTOs\CreateLeagueDTO;
use App\Modules\League\Application\DTOs\UpdateLeagueDTO;
use App\Modules\League\Application\Queries\GetLeagueAdminQuery;
use App\Modules\League\Application\Queries\GetLeaguesAdminQuery;
use App\Modules\League\Application\Queries\GetLeagueDetailAdminQuery;
use App\Modules\League\Domain\Exceptions\LeagueNotFoundException;
use App\Modules\League\Domain\Exceptions\InvalidLeagueDateException;
use App\Modules\League\Presentation\Http\Requests\CreateLeagueRequest;
use App\Modules\League\Presentation\Http\Requests\UpdateLeagueRequest;
use App\Modules\League\Presentation\Http\Resources\LeagueResource;
use App\Modules\League\Presentation\Http\Resources\LeagueDetailResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class AdminLeagueController extends Controller
{
    public function __construct(
        private CreateLeagueCommand $createLeagueCommand,
        private UpdateLeagueAdminCommand $updateLeagueCommand,
        private DestroyLeagueAdminCommand $destroyLeagueCommand,
        private GetLeagueAdminQuery $getLeagueQuery,
        private GetLeaguesAdminQuery $getLeaguesQuery,
        private GetLeagueDetailAdminQuery $getLeagueDetailQuery,
    ) {}

    public function index(): JsonResponse
    {
        $leagues = $this->getLeaguesQuery->execute();
        return response()->json([
            'success' => true,
            'data' => LeagueResource::collection($leagues)
        ]);
    }

    public function show(string $id): JsonResponse
    {
        try {
            $league = $this->getLeagueQuery->execute($id);
            return response()->json([
                'success' => true,
                'data' => new LeagueResource($league)
            ]);
        } catch (LeagueNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        }
    }

    public function showDetail(string $id): JsonResponse
    {
        try {
            $league = $this->getLeagueDetailQuery->execute($id);
            return response()->json([
                'success' => true,
                'data' => new LeagueDetailResource($league)
            ]);
        } catch (LeagueNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        }
    }

    public function store(CreateLeagueRequest $request): JsonResponse
    {
        try {
            $dto = CreateLeagueDTO::fromArray($request->validated());
            $leagueId = $this->createLeagueCommand->execute($dto);
            return response()->json([
                'success' => true,
                'message' => 'Lliga creada correctament',
                'data' => ['id' => $leagueId]
            ], 201);
        } catch (InvalidLeagueDateException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function update(UpdateLeagueRequest $request, string $id): JsonResponse
    {
        try {
            $dto = UpdateLeagueDTO::fromArray($request->validated());
            $this->updateLeagueCommand->execute($id, $dto);
            return response()->json([
                'success' => true,
                'message' => 'Lliga actualitzada correctament'
            ]);
        } catch (LeagueNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        } catch (InvalidLeagueDateException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
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
            $this->destroyLeagueCommand->execute($id);
            return response()->json([
                'success' => true,
                'message' => 'Lliga eliminada correctament'
            ]);
        } catch (LeagueNotFoundException $e) {
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
