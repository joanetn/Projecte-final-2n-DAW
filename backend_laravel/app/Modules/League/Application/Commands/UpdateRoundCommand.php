<?php

namespace App\Modules\League\Application\Commands;

use App\Modules\League\Application\DTOs\UpdateRoundDTO;
use App\Modules\League\Domain\Exceptions\RoundNotFoundException;
use App\Modules\League\Domain\Repositories\RoundRepositoryInterface;
use App\Modules\League\Domain\Services\RoundDomainService;

class UpdateRoundCommand
{
    public function __construct(
        private RoundRepositoryInterface $roundRepositoryInterface,
        private RoundDomainService $roundDomainService
    ) {}

    public function execute(string $roundId, UpdateRoundDTO $dto): void
    {
        $round = $this->roundRepositoryInterface->findById($roundId);

        if (!$round) {
            throw new RoundNotFoundException($roundId);
        }

        if ($dto->dataInici !== null) {
            $this->roundDomainService->validRoundIniDate($dto->dataInici);
        }

        if ($dto->dataInici !== null && $dto->dataFi !== null) {
            $this->roundDomainService->validRoundEndDate($dto->dataInici, $dto->dataFi);
        }

        $updateData = array_filter([
            'nom' => $dto->nom,
            'dataInici' => $dto->dataInici,
            'dataFi' => $dto->dataFi,
            'status' => $dto->status,
            'isActive' => $dto->isActive
        ], fn($value) => $value !== null);

        $this->roundRepositoryInterface->update($roundId, $updateData);
    }
}
