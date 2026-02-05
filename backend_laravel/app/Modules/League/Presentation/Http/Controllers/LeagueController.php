<?php

namespace App\Modules\League\Presentation\Http\Controllers;

use App\Modules\League\Application\Commands\CreateLeagueCommand;
use App\Modules\League\Application\Commands\UpdateLeagueCommand;
use App\Modules\League\Application\Queries\GetLeagueQuery;
use App\Modules\League\Application\Queries\GetLeaguesDetailQuery;
use App\Modules\League\Application\Queries\GetLeaguesQuery;
use App\Modules\League\Domain\Exceptions\LeagueNotFoundException;
use App\Modules\League\Presentation\Http\Resources\LeagueResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class LeagueController extends Controller
{
    public function __construct(
        private CreateLeagueCommand $createLeagueCommand,
        private UpdateLeagueCommand $updateLeagueCommand,
        private GetLeagueQuery $getLeagueQuery,
        private GetLeaguesQuery $getLeaguesQuery,
        private GetLeaguesDetailQuery $getLeaguesDetailQuery
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
}
