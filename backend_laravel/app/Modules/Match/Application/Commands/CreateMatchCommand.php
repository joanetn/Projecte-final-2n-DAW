<?php

namespace Modules\Match\Application\Commands;

use Modules\Match\Application\DTOs\CreateMatchDTO;
use Modules\Match\Domain\Repositories\MatchRepositoryInterface;
use Modules\Match\Domain\Events\MatchCreatedEvent;
use Modules\Match\Domain\Services\MatchDomainService;
use Illuminate\Support\Facades\Event;

class CreateMatchCommand
{
    public function __construct(
        private MatchRepositoryInterface $matchRepoInterf,
        private MatchDomainService $domainService
    ) {
    }

    public function execute(CreateMatchDTO $dto): string
    {
        $this->domainService->validateMatchDate($dto->dataHora);

        $match = $this->matchRepoInterf->create([
            'jornadaId' => $dto->jornadaId,
            'localId' => $dto->localId,
            'visitantId' => $dto->visitantId,
            'dataHora' => $dto->dataHora,
            'pistaId' => $dto->pistaId,
            'arbitreId' => $dto->arbitreId,
            'status' => $dto->status ?? 'PENDENT',
        ]);

        Event::dispatch(new MatchCreatedEvent($match));

        return $match->id;
    }
}