<?php

namespace App\Modules\AdminWeb\Infrastructure\Persistence\Eloquent\Repositories;

use App\Models\Lliga;
use App\Models\Partit;
use App\Models\PropostaCanviDataPartit;
use App\Modules\AdminWeb\Domain\Repositories\AdminLeaguePlannerRepositoryInterface;
use App\Modules\AdminWeb\Infrastructure\Persistence\Eloquent\Models\LeagueModel;
use App\Modules\AdminWeb\Infrastructure\Persistence\Eloquent\Models\MatchModel;
use App\Modules\AdminWeb\Infrastructure\Persistence\Eloquent\Models\RescheduleProposalModel;
use App\Modules\AdminWeb\Infrastructure\Persistence\Eloquent\Models\RoundModel;
use App\Modules\AdminWeb\Infrastructure\Persistence\Eloquent\Models\TeamModel;
use App\Modules\AdminWeb\Infrastructure\Persistence\Eloquent\Models\TeamUserModel;
use App\Modules\AdminWeb\Infrastructure\Persistence\Mappers\RescheduleProposalMapper;
use App\Modules\AdminWeb\Infrastructure\Persistence\Mappers\TeamMapper;

/**
 * Implementación Eloquent del repositorio de planificación de ligas.
 *
 * Solo contiene acceso y persistencia de datos; la lógica de negocio vive en Commands/Queries.
 */
class EloquentAdminLeaguePlannerRepository implements AdminLeaguePlannerRepositoryInterface
{
    public function getActiveLeagueTeams(string $leagueId): array
    {
        return TeamModel::query()
            ->where('lligaId', $leagueId)
            ->where('isActive', true)
            ->orderBy('nom')
            ->get(['id', 'nom', 'categoria', 'isActive'])
            ->map(fn(TeamModel $team) => TeamMapper::toSummaryArray($team))
            ->toArray();
    }

    public function findLeagueById(string $leagueId): ?Lliga
    {
        return LeagueModel::find($leagueId);
    }

    public function hasGeneratedFixtures(string $leagueId): bool
    {
        return RoundModel::query()
            ->where('lligaId', $leagueId)
            ->where('isActive', true)
            ->exists();
    }

    public function deleteLeagueFixtures(string $leagueId): void
    {
        $roundIds = RoundModel::query()
            ->where('lligaId', $leagueId)
            ->pluck('id');

        if ($roundIds->isNotEmpty()) {
            MatchModel::query()->whereIn('jornadaId', $roundIds)->delete();
        }

        RoundModel::query()->where('lligaId', $leagueId)->delete();
    }

    public function createRound(string $leagueId, string $name, \DateTimeInterface $start, ?\DateTimeInterface $end = null): string
    {
        $round = RoundModel::create([
            'nom' => $name,
            'lligaId' => $leagueId,
            'dataInici' => $start,
            'dataFi' => $end,
            'status' => 'PENDENT',
            'isActive' => true,
        ]);

        return $round->id;
    }

    public function createMatch(array $data): string
    {
        $match = MatchModel::create($data);

        return $match->id;
    }

    public function findMatchById(string $matchId): ?Partit
    {
        return MatchModel::query()->find($matchId);
    }

    public function isTeamAdmin(string $userId, string $teamId): bool
    {
        return TeamUserModel::query()
            ->where('usuariId', $userId)
            ->where('equipId', $teamId)
            ->where('isActive', true)
            ->whereRaw('LOWER("rolEquip") in (?, ?)', ['entrenador', 'delegat'])
            ->exists();
    }

    public function getAdminTeamIdsForUser(string $userId): array
    {
        return TeamUserModel::query()
            ->where('usuariId', $userId)
            ->where('isActive', true)
            ->whereRaw('LOWER("rolEquip") in (?, ?)', ['entrenador', 'delegat'])
            ->pluck('equipId')
            ->unique()
            ->values()
            ->toArray();
    }

    public function createRescheduleProposal(array $data): string
    {
        $proposal = RescheduleProposalModel::create($data);

        return $proposal->id;
    }

    public function findPendingProposalForMatch(string $matchId): ?PropostaCanviDataPartit
    {
        return RescheduleProposalModel::query()
            ->where('partitId', $matchId)
            ->where('estat', 'PENDENT')
            ->where('isActive', true)
            ->first();
    }

    public function findProposalById(string $proposalId): ?PropostaCanviDataPartit
    {
        return RescheduleProposalModel::query()->find($proposalId);
    }

    public function getProposalsForAdminTeams(string $userId, ?string $status = null): array
    {
        $adminTeamIds = $this->getAdminTeamIdsForUser($userId);

        if (empty($adminTeamIds)) {
            return [];
        }

        $query = RescheduleProposalModel::query()
            ->with(['partit.local', 'partit.visitant', 'equipProposa', 'equipReceptor', 'proposatPerUsuari', 'respostaPerUsuari'])
            ->where('isActive', true)
            ->where(function ($q) use ($adminTeamIds) {
                $q->whereIn('equipProposaId', $adminTeamIds)
                    ->orWhereIn('equipReceptorId', $adminTeamIds);
            })
            ->orderByDesc('created_at');

        if ($status) {
            $query->where('estat', strtoupper($status));
        }

        return $query->get()
            ->map(fn(RescheduleProposalModel $proposal) => RescheduleProposalMapper::toArray($proposal))
            ->toArray();
    }

    public function updateProposal(string $proposalId, array $updates): void
    {
        RescheduleProposalModel::query()->where('id', $proposalId)->update($updates);
    }

    public function updateMatchDateTime(string $matchId, \DateTimeInterface $dateTime): void
    {
        MatchModel::query()->where('id', $matchId)->update(['dataHora' => $dateTime]);
    }
}
