<?php

namespace Modules\Match\Application\Commands;

use Modules\Match\Application\DTOs\UpdateMatchDTO;
use Modules\Match\Domain\Services\MatchDomainService;
use Modules\Match\Domain\Exceptions\MatchNotFoundException;
use Modules\Match\Domain\Repositories\MatchRepositoryInterface;


class UpdateMatchCommand
{
    public function __construct(
        private MatchRepositoryInterface $matchRepoInterf,
        private MatchDomainService $domainService
    ) {
    }

    public function execute(string $matchId, UpdateMatchDTO $dto): void {
        $match = $this->matchRepoInterf->findById($matchId);

        if (!$match) {
            throw new MatchNotFoundException($matchId);
        }

        if (!$this->domainService->canUpdateMatch($match)) {
            throw new \Exception("No es pot actualitzar un partit completat o cancel·lat");
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
        ], fn($value) => $value !== null);

        $this->matchRepoInterf->update($matchId, $updateData);
    }
}