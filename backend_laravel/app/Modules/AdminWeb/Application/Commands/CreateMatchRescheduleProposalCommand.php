<?php

namespace App\Modules\AdminWeb\Application\Commands;

use App\Modules\AdminWeb\Application\DTOs\CreateMatchRescheduleProposalDTO;
use App\Modules\AdminWeb\Domain\Exceptions\InvalidRescheduleProposalException;
use App\Modules\AdminWeb\Domain\Repositories\AdminLeaguePlannerRepositoryInterface;
use App\Modules\AdminWeb\Domain\Services\AdminLeaguePlannerDomainService;
use Carbon\Carbon;
use Illuminate\Support\Str;

/**
 * Command para enviar propuestas de cambio de fecha de un partido.
 *
 * Seguridad:
 * - Solo puede proponer un admin del equipo (entrenador/delegat) de uno
 *   de los dos equipos que juegan el partido.
 * - La propuesta se envía al equipo contrario.
 */
class CreateMatchRescheduleProposalCommand
{
    public function __construct(
        private AdminLeaguePlannerRepositoryInterface $repository,
        private AdminLeaguePlannerDomainService $domainService,
    ) {}

    /**
     * @return array{id:string,message:string}
     */
    public function execute(CreateMatchRescheduleProposalDTO $dto): array
    {
        $matchId = $dto->matchId;
        $requestUserId = $dto->requestUserId;
        $proposedDateTime = $dto->proposedDateTime;
        $reason = $dto->reason;

        $match = $this->repository->findMatchById($matchId);

        if (!$match) {
            throw InvalidRescheduleProposalException::matchNotFound();
        }

        $isLocalAdmin = $this->repository->isTeamAdmin($requestUserId, $match->localId);
        $isAwayAdmin = $this->repository->isTeamAdmin($requestUserId, $match->visitantId);
        $this->domainService->ensureUserCanSendProposal($isLocalAdmin, $isAwayAdmin);

        $pending = $this->repository->findPendingProposalForMatch($matchId);
        $this->domainService->ensureNoPendingProposal($pending);

        $proposed = Carbon::parse($proposedDateTime);
        $this->domainService->ensureDifferentDate(
            $match->dataHora ? Carbon::parse($match->dataHora)->toISOString() : null,
            $proposed,
        );

        $proposerTeamId = $isLocalAdmin ? $match->localId : $match->visitantId;
        $receiverTeamId = $proposerTeamId === $match->localId ? $match->visitantId : $match->localId;

        $proposalId = $this->repository->createRescheduleProposal([
            'id' => Str::uuid()->toString(),
            'partitId' => $match->id,
            'equipProposaId' => $proposerTeamId,
            'equipReceptorId' => $receiverTeamId,
            'proposatPerUsuariId' => $requestUserId,
            'dataHoraProposada' => $proposed,
            'motiu' => $reason,
            'estat' => 'PENDENT',
            'isActive' => true,
        ]);

        return [
            'id' => $proposalId,
            'message' => 'Propuesta enviada correctamente',
        ];
    }
}
