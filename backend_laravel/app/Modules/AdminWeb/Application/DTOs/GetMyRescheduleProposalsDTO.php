<?php

namespace App\Modules\AdminWeb\Application\DTOs;

class GetMyRescheduleProposalsDTO
{
    public function __construct(
        public readonly string $userId,
        public readonly ?string $status = null,
    ) {}
}
