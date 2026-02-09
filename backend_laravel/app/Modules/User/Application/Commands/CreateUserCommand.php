<?php

namespace App\Modules\User\Application\Commands;

use App\Modules\User\Application\DTOs\CreateUserDTO;
use App\Modules\User\Domain\Repositories\UserRepositoryInterface;
use App\Modules\User\Domain\Services\UserDomainService;

class CreateUserCommand
{
    public function __construct(
        private UserRepositoryInterface $userRepositoryInterface,
        private UserDomainService $userDomainService
    ) {}

    public function execute(CreateUserDTO $createUserDTO): string
    {
        // Validar que el usuario puede ser creado
        if (!$this->userDomainService->canUserBeCreated($createUserDTO->email)) {
            throw new \Exception("L'email '{$createUserDTO->email}' ja està registrat");
        }

        // Validar datos
        $this->userDomainService->validateName($createUserDTO->nom);
        $this->userDomainService->validateEmail($createUserDTO->email);
        $this->userDomainService->validatePassword($createUserDTO->contrasenya);
        $this->userDomainService->validateBirthDate($createUserDTO->dataNaixement);
        $this->userDomainService->validatePhone($createUserDTO->telefon);

        // Crear usuario con contraseña hasheada
        $user = $this->userRepositoryInterface->create([
            'nom' => $createUserDTO->nom,
            'email' => $createUserDTO->email,
            'contrasenya' => bcrypt($createUserDTO->contrasenya),
            'telefon' => $createUserDTO->telefon,
            'dataNaixement' => $createUserDTO->dataNaixement,
            'avatar' => $createUserDTO->avatar,
            'dni' => $createUserDTO->dni,
            'isActive' => true,
        ]);

        return $user->id;
    }
}
