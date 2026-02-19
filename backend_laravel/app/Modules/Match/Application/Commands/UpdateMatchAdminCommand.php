<?php

namespace App\Modules\Match\Application\Commands;

use App\Modules\Match\Application\DTOs\UpdateMatchDTO;
use App\Modules\Match\Domain\Services\MatchDomainService;
use App\Modules\Match\Domain\Exceptions\MatchNotFoundException;
use App\Modules\Match\Domain\Repositories\MatchRepositoryInterface;

class UpdateMatchAdminCommand
{
    public function __construct(
        private MatchRepositoryInterface $matchRepoInterf,
        private MatchDomainService $domainService
    ) {}

    public function execute(string $matchId, UpdateMatchDTO $dto): void
    {
        $match = $this->matchRepoInterf->findByIdIncludingInactive($matchId);
        if (!$match) {
            throw new MatchNotFoundException($matchId);
        }
        if ($dto->dataHora !== null) {
            $this->domainService->validateMatchDate($dto->dataHora);
        }
        $updateData = array_filter([
            'jornadaId' => $dto->jornadaId,
            'localId' => $dto->localId,
            'visitantId' => $dto->visitantId,
            'dataHora' => $dto->dataHora,
            'pistaId' => $dto->pistaId,
            'arbitreId' => $dto->arbitreId,
            'status' => $dto->status,
            'isActive' => $dto->isActive
        ], fn($value) => $value !== null);
        $this->matchRepoInterf->update($matchId, $updateData);
    }
}
