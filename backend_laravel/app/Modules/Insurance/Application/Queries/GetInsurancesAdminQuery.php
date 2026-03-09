<?php

namespace App\Modules\Insurance\Application\Queries;

use App\Modules\Insurance\Domain\Repositories\InsuranceRepositoryInterface;

class GetInsurancesAdminQuery
{
    public function __construct(
        private InsuranceRepositoryInterface $repo
    ) {}

    public function execute(): array
    {
        return $this->repo->findAllIncludingInactiveWithRelations([
            'usuari'
        ]);
    }
}
