<?php

namespace App\Modules\User\Application\Commands;

use App\Modules\User\Domain\Repositories\UserRolRepositoryInterface;

class DestroyUserRolCommand
{
    public function __construct(
        private UserRolRepositoryInterface $userRolRepositoryInterface,
    ) {}

    public function execute(string $usuariId, string $rolId): bool
    {
        // Validar que el rol existe
        $rol = $this->userRolRepositoryInterface->findById($rolId);
        if (!$rol || $rol->usuariId !== $usuariId) {
            throw new \Exception("El rol no existeix per a aquest usuari");
        }

        // Validar que el usuario tiene al menos 2 roles (no sea el único)
        $userRols = $this->userRolRepositoryInterface->findByUserId($usuariId);
        if (count($userRols) <= 1) {
            throw new \Exception("L'usuari ha de mantenir almenys un rol");
        }

        // Eliminar el rol
        return $this->userRolRepositoryInterface->delete($rolId);
    }
}
