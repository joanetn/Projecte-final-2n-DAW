<?php

namespace App\Modules\User\Application\Commands;

use App\Modules\User\Application\DTOs\UpdateUserDTO;
use App\Modules\User\Domain\Exceptions\UserNotFoundException;
use App\Modules\User\Domain\Repositories\UserRepositoryInterface;
use App\Modules\User\Domain\Services\UserDomainService;

class UpdateUserAdminCommand
{
    public function __construct(
        private UserRepositoryInterface $userRepositoryInterface,
        private UserDomainService $userDomainService
    ) {}

    public function execute(string $userId, UpdateUserDTO $dto): void
    {
        $user = $this->userRepositoryInterface->findByIdIncludingInactive($userId);

        if (!$user) {
            throw new UserNotFoundException();
        }

        if ($dto->nom !== null) {
            $this->userDomainService->validateName($dto->nom);
        }

        if ($dto->email !== null) {
            $this->userDomainService->validateEmail($dto->email, $userId);
        }

        if ($dto->contrasenya !== null) {
            $this->userDomainService->validatePassword($dto->contrasenya);
        }

        if ($dto->dataNaixement !== null) {
            $this->userDomainService->validateBirthDate($dto->dataNaixement);
        }

        if ($dto->telefon !== null) {
            $this->userDomainService->validatePhone($dto->telefon);
        }

        $updateData = array_filter([
            'nom' => $dto->nom,
            'email' => $dto->email,
            'contrasenya' => $dto->contrasenya ? bcrypt($dto->contrasenya) : null,
            'telefon' => $dto->telefon,
            'dataNaixement' => $dto->dataNaixement,
            'avatar' => $dto->avatar,
            'dni' => $dto->dni,
            'isActive' => $dto->isActive,
        ], fn($value) => $value !== null);

        $this->userRepositoryInterface->update($userId, $updateData);
    }
}
