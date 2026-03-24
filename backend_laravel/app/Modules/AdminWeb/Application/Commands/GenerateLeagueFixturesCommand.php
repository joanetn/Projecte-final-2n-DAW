<?php

namespace App\Modules\AdminWeb\Application\Commands;

use App\Modules\AdminWeb\Application\DTOs\GenerateLeagueFixturesDTO;
use App\Modules\AdminWeb\Domain\Entities\LeagueSchedule;
use App\Modules\AdminWeb\Domain\Exceptions\LeagueNotFoundException;
use App\Modules\AdminWeb\Domain\Repositories\AdminLeaguePlannerRepositoryInterface;
use App\Modules\AdminWeb\Domain\Services\AdminLeaguePlannerDomainService;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Command que genera el calendario completo de una liga (ida y vuelta).
 *
 * Reglas principales:
 * - Calcula automáticamente jornadas para round-robin de doble vuelta.
 * - Una jornada por semana a partir de la fecha de inicio de la liga.
 * - Cada equipo juega como máximo un partido por jornada.
 * - Sin duplicar enfrentamientos dentro de la misma vuelta.
 */
class GenerateLeagueFixturesCommand
{
    public function __construct(
        private AdminLeaguePlannerRepositoryInterface $repository,
        private AdminLeaguePlannerDomainService $domainService,
    ) {}

    public function execute(GenerateLeagueFixturesDTO $dto): LeagueSchedule
    {
        $leagueId = $dto->leagueId;
        $force = $dto->force;

        $league = $this->repository->findLeagueById($leagueId);

        if (!$league) {
            throw LeagueNotFoundException::byId($leagueId);
        }

        $teams = $this->repository->getActiveLeagueTeams($leagueId);
        $this->domainService->ensureMinimumTeams($teams);

        $alreadyGenerated = $this->repository->hasGeneratedFixtures($leagueId);
        $this->domainService->ensureCanGenerateFixtures($alreadyGenerated, $force);

        return DB::transaction(function () use ($league, $teams, $alreadyGenerated, $force, $leagueId) {
            if ($alreadyGenerated && $force) {
                $this->repository->deleteLeagueFixtures($leagueId);
            }

            $teamIds = array_map(fn(array $team) => $team['id'], $teams);
            shuffle($teamIds);

            if (count($teamIds) % 2 !== 0) {
                $teamIds[] = null;
            }

            $totalSlots = count($teamIds);
            $matchesPerRound = intdiv($totalSlots, 2);
            $roundsPerLeg = $totalSlots - 1;
            $totalRounds = $roundsPerLeg * 2;

            $firstLegRounds = [];
            $rotation = $teamIds;

            for ($roundIndex = 0; $roundIndex < $roundsPerLeg; $roundIndex++) {
                $roundMatches = [];

                for ($pairIndex = 0; $pairIndex < $matchesPerRound; $pairIndex++) {
                    $home = $rotation[$pairIndex];
                    $away = $rotation[$totalSlots - 1 - $pairIndex];

                    if ($home === null || $away === null) {
                        continue;
                    }

                    if ($roundIndex % 2 === 1) {
                        [$home, $away] = [$away, $home];
                    }

                    $roundMatches[] = [
                        'localId' => $home,
                        'visitantId' => $away,
                    ];
                }

                $firstLegRounds[] = $roundMatches;

                $fixed = array_shift($rotation);
                $rest = $rotation;
                $last = array_pop($rest);
                array_unshift($rest, $last);
                $rotation = array_merge([$fixed], $rest);
            }

            $baseDate = $league->dataInici
                ? Carbon::parse($league->dataInici)->startOfDay()
                : now()->startOfDay();

            $createdMatches = 0;

            for ($roundNumber = 1; $roundNumber <= $totalRounds; $roundNumber++) {
                $secondLeg = $roundNumber > $roundsPerLeg;
                $sourceRoundIndex = $secondLeg ? $roundNumber - $roundsPerLeg - 1 : $roundNumber - 1;
                $roundMatches = $firstLegRounds[$sourceRoundIndex] ?? [];

                $roundStart = $baseDate->copy()->addWeeks($roundNumber - 1);
                $roundEnd = $roundStart->copy()->addDays(6)->endOfDay();

                $roundId = $this->repository->createRound(
                    leagueId: $league->id,
                    name: "Jornada {$roundNumber}",
                    start: $roundStart,
                    end: $roundEnd,
                );

                foreach ($roundMatches as $match) {
                    $localId = $secondLeg ? $match['visitantId'] : $match['localId'];
                    $visitantId = $secondLeg ? $match['localId'] : $match['visitantId'];

                    $this->repository->createMatch([
                        'jornadaId' => $roundId,
                        'localId' => $localId,
                        'visitantId' => $visitantId,
                        'dataHora' => $roundStart->copy()->setTime(10, 0),
                        'status' => 'PENDENT',
                        'setsLocal' => 0,
                        'setsVisitant' => 0,
                        'isActive' => true,
                    ]);

                    $createdMatches++;
                }
            }

            return new LeagueSchedule(
                lligaId: $league->id,
                lligaNom: $league->nom,
                equipCount: count($teams),
                jornadesGenerades: $totalRounds,
                partitsGenerats: $createdMatches,
                rerandomized: $alreadyGenerated && $force,
                message: $alreadyGenerated && $force
                    ? 'Partits re-generats correctament (ida i tornada)'
                    : 'Partits generats correctament (ida i tornada)',
            );
        });
    }
}
