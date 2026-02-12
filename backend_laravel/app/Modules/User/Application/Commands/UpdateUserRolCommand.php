<?php

namespace App\Modules\User\Application\Commands;

use App\Modules\User\Application\DTOs\UpdateUserRolDTO;
use App\Modules\User\Domain\Repositories\UserRolRepositoryInterface;

class UpdateUserRolCommand
{
    public function __construct(
        private UserRolRepositoryInterface $userRolRepositoryInterface,
    ) {}

    public function execute(UpdateUserRolDTO $dto): bool
    {
        $rol = $this->userRolRepositoryInterface->findById($dto->rolId);
        if (!$rol || $rol->usuariId !== $dto->usuariId) {
            throw new \Exception("El rol no existeix per a aquest usuari");
        }

        return $this->userRolRepositoryInterface->update($dto->rolId, [
            'isActive' => $dto->isActive,
        ]);
    }
}
