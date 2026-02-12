<?php

namespace App\Modules\User\Application\Commands;

use App\Modules\User\Application\DTOs\CreateUserRolDTO;
use App\Modules\User\Domain\Repositories\UserRepositoryInterface;
use App\Modules\User\Domain\Repositories\UserRolRepositoryInterface;

class CreateUserRolCommand
{
    public function __construct(
        private UserRepositoryInterface $userRepositoryInterface,
        private UserRolRepositoryInterface $userRolRepositoryInterface,
    ) {}

    public function execute(CreateUserRolDTO $dto): string
    {
        $user = $this->userRepositoryInterface->findById($dto->usuariId);
        if (!$user) {
            throw new \Exception("L'usuari no existeix");
        }

        $existingRols = $this->userRolRepositoryInterface->findByUserId($dto->usuariId);

        $hasArbitra = collect($existingRols)->contains(fn($rol) => $rol->rol === 'arbitre');
        if ($hasArbitra && $dto->rol !== 'arbitre') {
            throw new \Exception("Un àrbitre només pot tenir el rol d'àrbitre");
        }

        if ($dto->rol === 'arbitre' && count($existingRols) > 0) {
            throw new \Exception("No es pot assignar el rol d'àrbitre a un usuari que ja té altres rols");
        }

        if (collect($existingRols)->contains(fn($rol) => $rol->rol === $dto->rol)) {
            throw new \Exception("L'usuari ja té aquest rol");
        }

        $rol = $this->userRolRepositoryInterface->create([
            'usuariId' => $dto->usuariId,
            'rol' => $dto->rol,
            'isActive' => true,
        ]);

        return $rol->id;
    }
}
