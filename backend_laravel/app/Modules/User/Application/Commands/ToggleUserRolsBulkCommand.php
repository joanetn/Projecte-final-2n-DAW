<?php

namespace App\Modules\User\Application\Commands;

use App\Modules\User\Application\DTOs\CreateUserRolDTO;
use App\Modules\User\Application\DTOs\CreateUserRolsBulkDTO;
use App\Modules\User\Domain\Repositories\UserRepositoryInterface;
use App\Modules\User\Domain\Repositories\UserRolRepositoryInterface;

class ToggleUserRolsBulkCommand
{
    public function __construct(
        private UserRepositoryInterface $userRepositoryInterface,
        private UserRolRepositoryInterface $userRolRepositoryInterface,
        private ToggleUserRolCommand $toggleUserRolCommand,
    ) {}

    public function execute(CreateUserRolsBulkDTO $dto): array
    {
        $user = $this->userRepositoryInterface->findById($dto->usuariId);
        if (!$user) {
            throw new \Exception("L'usuari no existeix");
        }

        $results = [];
        $errors = [];

        foreach ($dto->roles as $rol) {
            try {
                $rolDto = new CreateUserRolDTO($dto->usuariId, $rol);
                $result = $this->toggleUserRolCommand->execute($rolDto);
                $results[] = [
                    'rol' => $rol,
                    'result' => $result,
                    'success' => true,
                ];
            } catch (\Exception $e) {
                $errors[] = [
                    'rol' => $rol,
                    'error' => $e->getMessage(),
                    'success' => false,
                ];
            }
        }

        return [
            'usuariId' => $dto->usuariId,
            'successful' => count($results),
            'failed' => count($errors),
            'results' => $results,
            'errors' => $errors,
        ];
    }
}
