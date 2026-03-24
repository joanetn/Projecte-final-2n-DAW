<?php

namespace App\Modules\Merchandise\Application\Commands;

use App\Modules\Merchandise\Application\DTOs\CreateMerchDTO;
use App\Modules\Merchandise\Domain\Repositories\MerchRepositoryInterface;
use Illuminate\Support\Str;

class CreateMerchCommand
{
    public function __construct(
        private MerchRepositoryInterface $repository,
    ) {}

    public function execute(CreateMerchDTO $dto): string
    {
        $id = Str::uuid()->toString();

        $this->repository->create([
            'id' => $id,
            'nom' => $dto->nom,
            'marca' => $dto->marca,
            'imageUrl' => $dto->imageUrl,
            'preu' => $dto->preu,
            'stock' => $dto->stock,
            'isActive' => true,
        ]);

        return $id;
    }
}
