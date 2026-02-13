<?php

namespace App\Modules\Venue\Application\Queries;

use App\Modules\Venue\Domain\Repositories\InstalacioRepositoryInterface;

class GetInstalacionsQuery
{
    public function __construct(
        private InstalacioRepositoryInterface $instalacioRepository
    ) {}

    public function execute(): array
    {
        return $this->instalacioRepository->findAllWithRelations(['pistes']);
    }
}
