<?php

namespace App\Modules\AdminWeb\Presentation\Http\Controllers;

use App\Modules\AdminWeb\Application\Commands\CreateMatchRescheduleProposalCommand;
use App\Modules\AdminWeb\Application\Commands\GenerateLeagueFixturesCommand;
use App\Modules\AdminWeb\Application\Commands\RespondMatchRescheduleProposalCommand;
use App\Modules\AdminWeb\Application\Queries\GetLeagueTeamsForSchedulingQuery;
use App\Modules\AdminWeb\Application\Queries\GetMyRescheduleProposalsQuery;
use App\Modules\AdminWeb\Domain\Exceptions\LeagueNotFoundException;
use App\Modules\AdminWeb\Domain\Exceptions\ProposalNotFoundException;
use App\Modules\AdminWeb\Domain\Repositories\AdminLeaguePlannerRepositoryInterface;
use App\Modules\AdminWeb\Presentation\Http\Requests\CreateMatchRescheduleProposalRequest;
use App\Modules\AdminWeb\Presentation\Http\Requests\GenerateLeagueFixturesRequest;
use App\Modules\AdminWeb\Presentation\Http\Requests\GetMyRescheduleProposalsRequest;
use App\Modules\AdminWeb\Presentation\Http\Requests\RespondMatchRescheduleProposalRequest;
use App\Modules\AdminWeb\Presentation\Http\Resources\LeagueScheduleResource;
use App\Modules\AdminWeb\Presentation\Http\Resources\LeagueTeamResource;
use App\Modules\AdminWeb\Presentation\Http\Resources\MatchRescheduleProposalResource;
use Carbon\Carbon;
use DomainException;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class AdminLeaguePlannerController extends Controller
{
    public function __construct(
        private GetLeagueTeamsForSchedulingQuery $getLeagueTeamsQuery,
        private GenerateLeagueFixturesCommand $generateLeagueFixturesCommand,
        private CreateMatchRescheduleProposalCommand $createProposalCommand,
        private GetMyRescheduleProposalsQuery $getMyProposalsQuery,
        private RespondMatchRescheduleProposalCommand $respondProposalCommand,
        private AdminLeaguePlannerRepositoryInterface $repository,
    ) {}

    public function equipsLliga(string $lligaId): JsonResponse
    {
        try {
            $league = $this->repository->findLeagueById($lligaId);
            if (!$league) {
                throw LeagueNotFoundException::byId($lligaId);
            }

            $teams = $this->getLeagueTeamsQuery->execute($lligaId);
            $fixturesGenerated = $this->repository->hasGeneratedFixtures($lligaId);

            return response()->json([
                'success' => true,
                'data' => [
                    'lliga' => [
                        'id' => $league->id,
                        'nom' => $league->nom,
                        'categoria' => $league->categoria,
                        'dataInici' => $league->dataInici ? Carbon::parse($league->dataInici)->toISOString() : null,
                        'fixturesGenerats' => $fixturesGenerated,
                    ],
                    'equips' => LeagueTeamResource::collection(collect($teams)),
                    'total' => count($teams),
                ],
            ]);
        } catch (LeagueNotFoundException | DomainException | \InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], $e->getCode() >= 400 ? $e->getCode() : 422);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error intern del servidor',
                'error' => config('app.debug') ? $e->getMessage() : 'Server error',
            ], 500);
        }
    }

    public function generarPartitsLliga(GenerateLeagueFixturesRequest $request, string $lligaId): JsonResponse
    {
        try {
            /** @var \App\Modules\AdminWeb\Domain\Entities\LeagueSchedule $result */
            $result = $this->generateLeagueFixturesCommand->execute($request->toDto($lligaId));

            return response()->json([
                'success' => true,
                'message' => $result->message,
                'data' => new LeagueScheduleResource($result),
            ]);
        } catch (LeagueNotFoundException | DomainException | \InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], $e->getCode() >= 400 ? $e->getCode() : 422);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error intern del servidor',
                'error' => config('app.debug') ? $e->getMessage() : 'Server error',
            ], 500);
        }
    }

    public function enviarPropostaCanviData(CreateMatchRescheduleProposalRequest $request, string $partitId): JsonResponse
    {
        try {
            $authUserId = (string) $request->input('auth_user_id');
            if (!$authUserId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuari no autenticat',
                ], 401);
            }

            $result = $this->createProposalCommand->execute($request->toDto($partitId, $authUserId));

            return response()->json([
                'success' => true,
                'message' => $result['message'],
                'data' => ['id' => $result['id']],
            ], 201);
        } catch (ProposalNotFoundException | DomainException | \InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], $e->getCode() >= 400 ? $e->getCode() : 422);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error intern del servidor',
                'error' => config('app.debug') ? $e->getMessage() : 'Server error',
            ], 500);
        }
    }

    public function mevesPropostes(GetMyRescheduleProposalsRequest $request): JsonResponse
    {
        try {
            $authUserId = (string) $request->input('auth_user_id');
            if (!$authUserId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuari no autenticat',
                ], 401);
            }

            $dto = $request->toDto($authUserId);
            $proposals = $this->getMyProposalsQuery->execute($dto);

            return response()->json([
                'success' => true,
                'data' => [
                    'propostes' => MatchRescheduleProposalResource::collection(collect($proposals)),
                    'total' => count($proposals),
                ],
            ]);
        } catch (DomainException | \InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], $e->getCode() >= 400 ? $e->getCode() : 422);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error intern del servidor',
                'error' => config('app.debug') ? $e->getMessage() : 'Server error',
            ], 500);
        }
    }

    public function respondreProposta(RespondMatchRescheduleProposalRequest $request, string $propostaId): JsonResponse
    {
        try {
            $authUserId = (string) $request->input('auth_user_id');
            if (!$authUserId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuari no autenticat',
                ], 401);
            }

            $result = $this->respondProposalCommand->execute($request->toDto($propostaId, $authUserId));

            return response()->json([
                'success' => true,
                'message' => $result['message'],
                'data' => ['accepted' => $result['accepted']],
            ]);
        } catch (ProposalNotFoundException | DomainException | \InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], $e->getCode() >= 400 ? $e->getCode() : 422);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error intern del servidor',
                'error' => config('app.debug') ? $e->getMessage() : 'Server error',
            ], 500);
        }
    }
}
