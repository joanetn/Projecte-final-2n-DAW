<?php

namespace App\Modules\AdminWeb\Application\Queries;

use App\Modules\AdminWeb\Application\DTOs\GetMyRescheduleProposalsDTO;
use App\Modules\AdminWeb\Domain\Entities\MatchRescheduleProposal;
use App\Modules\AdminWeb\Domain\Repositories\AdminLeaguePlannerRepositoryInterface;

/**
 * Query para listar propuestas de cambio de fecha visibles para un admin de equipo.
 *
 * Devuelve propuestas enviadas y recibidas de los equipos donde el usuario
 * tiene rol de administración de equipo (entrenador/delegat).
 */
class GetMyRescheduleProposalsQuery
{
    public function __construct(
        private AdminLeaguePlannerRepositoryInterface $repository,
    ) {}

    /**
     * @return array<int, MatchRescheduleProposal>
     */
    public function execute(GetMyRescheduleProposalsDTO $dto): array
    {
        $items = $this->repository->getProposalsForAdminTeams($dto->userId, $dto->status);

        return array_map(
            fn(array $item): MatchRescheduleProposal => MatchRescheduleProposal::fromArray($item),
            $items,
        );
    }
}
