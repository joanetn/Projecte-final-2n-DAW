<?php

namespace App\Modules\AdminWeb\Application\DTOs;

class CreateMatchRescheduleProposalDTO
{
    public function __construct(
        public readonly string $matchId,
        public readonly string $requestUserId,
        public readonly string $proposedDateTime,
        public readonly ?string $reason = null,
    ) {}
}
