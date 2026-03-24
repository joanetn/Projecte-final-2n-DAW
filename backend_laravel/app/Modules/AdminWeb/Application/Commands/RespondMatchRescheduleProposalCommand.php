<?php

namespace App\Modules\AdminWeb\Application\Commands;

use App\Modules\AdminWeb\Application\DTOs\RespondMatchRescheduleProposalDTO;
use App\Modules\AdminWeb\Domain\Exceptions\ProposalNotFoundException;
use App\Modules\AdminWeb\Domain\Repositories\AdminLeaguePlannerRepositoryInterface;
use App\Modules\AdminWeb\Domain\Services\AdminLeaguePlannerDomainService;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Command para aceptar o rechazar propuestas de cambio de fecha.
 *
 * Seguridad:
 * - Solo puede responder un admin del equipo receptor de la propuesta.
 *
 * Reglas:
 * - Si se acepta, se actualiza la fecha del partido.
 * - Si se rechaza, se mantiene la fecha anterior.
 */
class RespondMatchRescheduleProposalCommand
{
    public function __construct(
        private AdminLeaguePlannerRepositoryInterface $repository,
        private AdminLeaguePlannerDomainService $domainService,
    ) {}

    /**
     * @return array{message:string,accepted:bool}
     */
    public function execute(RespondMatchRescheduleProposalDTO $dto): array
    {
        $proposalId = $dto->proposalId;
        $requestUserId = $dto->requestUserId;
        $action = $dto->action;
        $responseText = $dto->responseText;

        $proposal = $this->repository->findProposalById($proposalId);

        if (!$proposal || !$proposal->isActive) {
            throw ProposalNotFoundException::byId($proposalId);
        }

        $this->domainService->ensureProposalIsPending((string) $proposal->estat);

        $isReceiverTeamAdmin = $this->repository->isTeamAdmin($requestUserId, $proposal->equipReceptorId);
        $this->domainService->ensureUserCanRespondProposal($isReceiverTeamAdmin);

        $normalized = $this->domainService->normalizeAction($action);

        $accept = $normalized === 'ACCEPTAR';

        DB::transaction(function () use ($proposal, $requestUserId, $responseText, $accept) {
            $this->repository->updateProposal($proposal->id, [
                'estat' => $accept ? 'ACCEPTADA' : 'REBUTJADA',
                'respostaText' => $responseText,
                'respostaPerUsuariId' => $requestUserId,
                'respostaAt' => now(),
            ]);

            if ($accept) {
                $this->repository->updateMatchDateTime(
                    $proposal->partitId,
                    Carbon::parse($proposal->dataHoraProposada),
                );
            }
        });

        return [
            'message' => $accept
                ? 'Propuesta aceptada y fecha del partido actualizada'
                : 'Propuesta rechazada. Se mantiene la fecha actual',
            'accepted' => $accept,
        ];
    }
}
