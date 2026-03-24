<?php

namespace App\Modules\AdminWeb\Application\DTOs;

class RespondMatchRescheduleProposalDTO
{
    public function __construct(
        public readonly string $proposalId,
        public readonly string $requestUserId,
        public readonly string $action,
        public readonly ?string $responseText = null,
    ) {}
}
