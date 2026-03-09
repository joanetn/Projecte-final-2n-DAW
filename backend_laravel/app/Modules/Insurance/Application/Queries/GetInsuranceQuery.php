<?php

namespace App\Modules\Insurance\Application\Queries;

use App\Modules\Insurance\Domain\Entities\Insurance;
use App\Modules\Insurance\Domain\Exceptions\InsuranceNotFoundException;
use App\Modules\Insurance\Domain\Repositories\InsuranceRepositoryInterface;

class GetInsuranceQuery
{
    public function __construct(
        private InsuranceRepositoryInterface $repo
    ) {}

    public function execute(string $id): Insurance
    {
        $insurance = $this->repo->findById($id);

        if (!$insurance) {
            throw new InsuranceNotFoundException();
        }

        return $insurance;
    }
}
