<?php

namespace App\Modules\Match\Application\Commands;

use App\Modules\Match\Application\DTOs\CreateMatchDTO;
use App\Modules\Match\Domain\Repositories\MatchRepositoryInterface;
use App\Modules\Match\Domain\Events\MatchCreatedEvent;
use App\Modules\Match\Domain\Services\MatchDomainService;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;

class CreateMatchCommand
{
    public function __construct(
        private MatchRepositoryInterface $matchRepoInterf,
        private MatchDomainService $domainService
    ) {}

    public function execute(CreateMatchDTO $dto): string
    {
        $this->domainService->validateMatchDate($dto->dataHora);

        $match = $this->matchRepoInterf->create([
            'id' => Str::uuid()->toString(),
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
