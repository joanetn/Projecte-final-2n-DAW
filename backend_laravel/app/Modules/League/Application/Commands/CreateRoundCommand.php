<?php

namespace App\Modules\League\Application\Commands;

use App\Modules\League\Application\DTOs\CreateRoundDTO;
use App\Modules\League\Domain\Repositories\RoundRepositoryInterface;
use App\Modules\League\Domain\Services\RoundDomainService;
use Illuminate\Support\Str;

class CreateRoundCommand
{
    public function __construct(
        private RoundRepositoryInterface $roundRepositoryInterface,
        private RoundDomainService $roundDomainService
    ) {}

    public function execute(CreateRoundDTO $dto): string
    {
        $this->roundDomainService->validRoundIniDate($dto->dataInici);
        $this->roundDomainService->validRoundEndDate($dto->dataInici, $dto->dataFi);

        $round = $this->roundRepositoryInterface->create([
            'id' => Str::uuid()->toString(),
            'nom' => $dto->nom,
            'lligaId' => $dto->lligaId,
            'dataInici' => $dto->dataInici,
            'dataFi' => $dto->dataFi,
            'status' => $dto->status,
            'isActive' => $dto->isActive,
        ]);

        return $round->id;
    }
}
