<?php

namespace App\Modules\League\Application\Queries;

use App\Modules\League\Domain\Repositories\RoundRepositoryInterface;

class GetRoundsQuery
{
    public function __construct(
        private RoundRepositoryInterface $roundRepositoryInterface
    ) {}

    public function execute(): array
    {
        return $this->roundRepositoryInterface->findAll();
    }
}
