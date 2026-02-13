<?php

namespace App\Modules\Venue\Application\Commands;

use App\Modules\Venue\Domain\Exceptions\InstalacioNotFoundException;
use App\Modules\Venue\Domain\Repositories\InstalacioRepositoryInterface;

class DestroyInstalacioCommand
{
    public function __construct(
        private InstalacioRepositoryInterface $instalacioRepository
    ) {}

    public function execute(string $instalacioId): void
    {
        $instalacio = $this->instalacioRepository->findById($instalacioId);
        if (!$instalacio) {
            throw new InstalacioNotFoundException();
        }

        $this->instalacioRepository->delete($instalacioId);
    }
}
