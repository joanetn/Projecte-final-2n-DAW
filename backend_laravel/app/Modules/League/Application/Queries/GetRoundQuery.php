<?php

namespace App\Modules\League\Application\Queries;

use App\Modules\League\Domain\Entities\Round;
use App\Modules\League\Domain\Exceptions\RoundNotFoundException;
use App\Modules\League\Domain\Repositories\RoundRepositoryInterface;

class GetRoundQuery
{
    public function __construct(
        private RoundRepositoryInterface $roundRepositoryInterface
    ) {}

    public function execute(string $roundId): Round
    {
        $round = $this->roundRepositoryInterface->findById($roundId);

        if (!$round) {
            throw new RoundNotFoundException($roundId);
        }

        return $round;
    }
}
