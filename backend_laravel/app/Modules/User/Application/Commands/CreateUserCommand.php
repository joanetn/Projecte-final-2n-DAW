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
        if (!$this->userDomainService->canUserBeCreated($createUserDTO->email)) {
            throw new \Exception("L'email '{$createUserDTO->email}' ja està registrat");
        }

        $this->userDomainService->validateName($createUserDTO->nom);
        $this->userDomainService->validateEmail($createUserDTO->email);
        $this->userDomainService->validatePassword($createUserDTO->contrasenya);
        $this->userDomainService->validateBirthDate($createUserDTO->dataNaixement);
        $this->userDomainService->validatePhone($createUserDTO->telefon);
        $this->userDomainService->validateLevel($createUserDTO->nivell);

        $avatar = $createUserDTO->avatar
            ?? 'https://ui-avatars.com/api/?name=' . urlencode($createUserDTO->nom) . '&background=random&size=128';

        $user = $this->userRepositoryInterface->create([
            'nom' => $createUserDTO->nom,
            'email' => $createUserDTO->email,
            'contrasenya' => bcrypt($createUserDTO->contrasenya),
            'telefon' => $createUserDTO->telefon,
            'dataNaixement' => $createUserDTO->dataNaixement,
            'avatar' => $avatar,
            'dni' => $createUserDTO->dni,
            'nivell' => $createUserDTO->nivell,
            'isActive' => true,
        ]);

        return $user->id;
    }
}
