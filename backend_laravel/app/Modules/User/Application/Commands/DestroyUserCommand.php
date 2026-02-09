<?php

namespace App\Modules\User\Application\Commands;

use App\Modules\User\Domain\Exceptions\UserNotFoundException;
use App\Modules\User\Domain\Repositories\UserRepositoryInterface;
use App\Modules\User\Domain\Services\UserDomainService;

class DestroyUserCommand
{
    public function __construct(
        private UserRepositoryInterface $userRepositoryInterface,
        private UserDomainService $userDomainService
    ) {}

    public function execute(string $userId): void
    {
        $user = $this->userRepositoryInterface->findById($userId);

        if (!$user) {
            throw new UserNotFoundException();
        }

        $this->userRepositoryInterface->delete($userId);
    }
}
