<?php

namespace App\Modules\League\Application\Commands;

use App\Modules\League\Application\DTOs\UpdateStandingDTO;
use App\Modules\League\Domain\Exceptions\StandingNotFoundException;
use App\Modules\League\Domain\Repositories\StandingRepositoryInterface;
use App\Modules\League\Domain\Services\StandingDomainService;

class UpdateStandingCommand
{
    public function __construct(
        private StandingRepositoryInterface $standingRepositoryInterface,
        private StandingDomainService $standingDomainService
    ) {}

    public function execute(string $standingId, UpdateStandingDTO $dto): void
    {
        $standing = $this->standingRepositoryInterface->findById($standingId);

        if (!$standing) {
            throw new StandingNotFoundException($standingId);
        }

        if ($dto->isActive === false && $standing->isActive) {
            $this->standingDomainService->validateCanDeactivate($standing);
        }

        $updateData = array_filter([
            'partitsJugats' => $dto->partitsJugats,
            'partitsGuanyats' => $dto->partitsGuanyats,
            'setsGuanyats' => $dto->setsGuanyats,
            'setPerduts' => $dto->setPerduts,
            'jocsGuanyats' => $dto->jocsGuanyats,
            'jocsPerduts' => $dto->jocsPerduts,
            'punts' => $dto->punts,
            'isActive' => $dto->isActive,
        ], fn($value) => $value !== null);

        if (!empty($updateData)) {
            $this->standingRepositoryInterface->update($standingId, $updateData);
        }
    }
}
