<?php

namespace App\Modules\AdminWeb\Domain\Repositories;

use App\Models\Lliga;
use App\Models\Partit;
use App\Models\PropostaCanviDataPartit;

/**
 * Contrato del repositorio para planificación de ligas y propuestas de cambio de fecha.
 *
 * Nota: aquí se centraliza acceso a datos para Commands/Queries de AdminWeb,
 * evitando meter SQL/Eloquent en controladores.
 */
interface AdminLeaguePlannerRepositoryInterface
{
    /** @return array<int, array{id:string,nom:string,categoria:?string,isActive:bool}> */
    public function getActiveLeagueTeams(string $leagueId): array;

    public function findLeagueById(string $leagueId): ?Lliga;

    public function hasGeneratedFixtures(string $leagueId): bool;

    public function deleteLeagueFixtures(string $leagueId): void;

    public function createRound(string $leagueId, string $name, \DateTimeInterface $start, ?\DateTimeInterface $end = null): string;

    public function createMatch(array $data): string;

    public function findMatchById(string $matchId): ?Partit;

    public function isTeamAdmin(string $userId, string $teamId): bool;

    /** @return string[] */
    public function getAdminTeamIdsForUser(string $userId): array;

    public function createRescheduleProposal(array $data): string;

    public function findPendingProposalForMatch(string $matchId): ?PropostaCanviDataPartit;

    public function findProposalById(string $proposalId): ?PropostaCanviDataPartit;

    /** @return array<int, array<string, mixed>> */
    public function getProposalsForAdminTeams(string $userId, ?string $status = null): array;

    public function updateProposal(string $proposalId, array $updates): void;

    public function updateMatchDateTime(string $matchId, \DateTimeInterface $dateTime): void;
}
