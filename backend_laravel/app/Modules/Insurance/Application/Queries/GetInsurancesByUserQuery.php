<?php

namespace App\Modules\Insurance\Application\Queries;

use App\Modules\Insurance\Domain\Repositories\InsuranceRepositoryInterface;

class GetInsurancesByUserQuery
{
    public function __construct(
        private InsuranceRepositoryInterface $repo
    ) {}

    public function execute(string $usuariId): array
    {
        return $this->repo->findAllByUserId($usuariId);
    }
}
