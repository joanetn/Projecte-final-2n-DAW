<?php

namespace App\Modules\Venue\Application\Queries;

use App\Modules\Venue\Domain\Entities\Instalacio;
use App\Modules\Venue\Domain\Exceptions\InstalacioNotFoundException;
use App\Modules\Venue\Domain\Repositories\InstalacioRepositoryInterface;

class GetInstalacioAdminQuery
{
    public function __construct(
        private InstalacioRepositoryInterface $instalacioRepository
    ) {}

    public function execute(string $instalacioId): Instalacio
    {
        $instalacio = $this->instalacioRepository->findByIdIncludingInactiveWithRelations($instalacioId, ['pistes']);
        if (!$instalacio) {
            throw new InstalacioNotFoundException();
        }
        return $instalacio;
    }
}
