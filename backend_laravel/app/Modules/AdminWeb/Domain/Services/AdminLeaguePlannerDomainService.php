<?php

namespace App\Modules\AdminWeb\Domain\Services;

use App\Modules\AdminWeb\Domain\Exceptions\InvalidRescheduleProposalException;
use Carbon\Carbon;

class AdminLeaguePlannerDomainService
{
    public function ensureMinimumTeams(array $teams): void
    {
        if (count($teams) < 2) {
            throw InvalidRescheduleProposalException::insufficientTeams();
        }
    }

    public function ensureCanGenerateFixtures(bool $alreadyGenerated, bool $force): void
    {
        if ($alreadyGenerated && !$force) {
            throw InvalidRescheduleProposalException::fixturesAlreadyGenerated();
        }
    }

    public function ensureUserCanSendProposal(bool $isLocalAdmin, bool $isAwayAdmin): void
    {
        if (!$isLocalAdmin && !$isAwayAdmin) {
            throw InvalidRescheduleProposalException::userCannotSendProposal();
        }
    }

    public function ensureNoPendingProposal(mixed $pendingProposal): void
    {
        if ($pendingProposal) {
            throw InvalidRescheduleProposalException::pendingProposalExists();
        }
    }

    public function ensureDifferentDate(?string $currentDateTime, Carbon $proposed): void
    {
        if ($currentDateTime && $proposed->equalTo(Carbon::parse($currentDateTime))) {
            throw InvalidRescheduleProposalException::sameDateTime();
        }
    }

    public function normalizeAction(string $action): string
    {
        $normalized = strtoupper(trim($action));

        if (!in_array($normalized, ['ACCEPTAR', 'RECHAZAR'], true)) {
            throw InvalidRescheduleProposalException::invalidAction();
        }

        return $normalized;
    }

    public function ensureProposalIsPending(string $status): void
    {
        if (strtoupper($status) !== 'PENDENT') {
            throw InvalidRescheduleProposalException::proposalAlreadyAnswered();
        }
    }

    public function ensureUserCanRespondProposal(bool $isReceiverTeamAdmin): void
    {
        if (!$isReceiverTeamAdmin) {
            throw InvalidRescheduleProposalException::userCannotRespondProposal();
        }
    }
}
