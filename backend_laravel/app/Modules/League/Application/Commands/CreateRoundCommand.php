<?php

namespace App\Modules\League\Application\Commands;

use App\Modules\League\Domain\Repositories\RoundRepositoryInterface;
use App\Modules\League\Domain\Services\LeagueDomainService;

class CreateRoundCommand
{
    public function __construct(
        private RoundRepositoryInterface $roundRepositoryInterface,
        private LeagueDomainService $leagueDomainService
    ) {}
}
