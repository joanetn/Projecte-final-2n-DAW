<?php

namespace App\Modules\User\Application\Commands;

use App\Modules\User\Application\DTOs\CreateUserRolDTO;
use App\Modules\User\Domain\Repositories\UserRepositoryInterface;
use App\Modules\User\Domain\Repositories\UserRolRepositoryInterface;

class ToggleUserRolCommand
{
    public function __construct(
        private UserRepositoryInterface $userRepositoryInterface,
        private UserRolRepositoryInterface $userRolRepositoryInterface,
    ) {}

    public function execute(CreateUserRolDTO $dto): array
    {
        // Validar que el usuario existe
        $user = $this->userRepositoryInterface->findById($dto->usuariId);
        if (!$user) {
            throw new \Exception("L'usuari no existeix");
        }

        // Buscar si el rol ya existe
        $existingRol = $this->userRolRepositoryInterface->findByUserIdAndRol($dto->usuariId, $dto->rol);

        if ($existingRol) {
            // Si existe, togglear isActive
            $newIsActive = !$existingRol->isActive;
            $this->userRolRepositoryInterface->update($existingRol->id, [
                'isActive' => $newIsActive,
            ]);

            return [
                'action' => 'toggled',
                'rolId' => $existingRol->id,
                'isActive' => $newIsActive,
            ];
        } else {
            // Si no existe, validar reglas de negocio
            $userRols = $this->userRolRepositoryInterface->findByUserId($dto->usuariId);

            // Si el usuario es árbitro, solo puede ser árbitro
            $hasArbitra = collect($userRols)->contains(fn($rol) => $rol->rol === 'arbitre' && $rol->isActive);
            if ($hasArbitra && $dto->rol !== 'arbitre') {
                throw new \Exception("Un àrbitre només pot tenir el rol d'àrbitre");
            }

            // Si intenta asignar árbitro a alguien que tiene otros roles activos, no permitir
            $hasOtherRoles = collect($userRols)->contains(fn($rol) => $rol->rol !== $dto->rol && $rol->isActive);
            if ($dto->rol === 'arbitre' && $hasOtherRoles) {
                throw new \Exception("No es pot assignar el rol d'àrbitre a un usuari que ja té altres rols actius");
            }

            // Crear el rol
            $rol = $this->userRolRepositoryInterface->create([
                'usuariId' => $dto->usuariId,
                'rol' => $dto->rol,
                'isActive' => true,
                'createdAt' => now(),
            ]);

            return [
                'action' => 'created',
                'rolId' => $rol->id,
                'isActive' => true,
            ];
        }
    }
}
