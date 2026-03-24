<?php

namespace App\Modules\AdminWeb\Application\Queries;

use App\Modules\AdminWeb\Domain\Repositories\AdminLeaguePlannerRepositoryInterface;

/**
 * Query para devolver los equipos activos inscritos en una liga.
 *
 * Esta consulta se usa en el panel admin para validar cuántos equipos hay
 * antes de generar jornadas y también para mostrar listados de inscritos.
 */
class GetLeagueTeamsForSchedulingQuery
{
    public function __construct(
        private AdminLeaguePlannerRepositoryInterface $repository,
    ) {}

    /**
     * @return array<int, array{id:string,nom:string,categoria:?string,isActive:bool}>
     */
    public function execute(string $leagueId): array
    {
        return $this->repository->getActiveLeagueTeams($leagueId);
    }
}
