<?php

namespace App\Modules\User\Application\Commands;

use App\Modules\User\Domain\Exceptions\UserNotFoundException;
use App\Modules\User\Domain\Repositories\UserRepositoryInterface;

class DestroyUserAdminCommand
{
    public function __construct(
        private UserRepositoryInterface $userRepositoryInterface
    ) {}

    public function execute(string $userId): void
    {
        $user = $this->userRepositoryInterface->findByIdIncludingInactive($userId);

        if (!$user) {
            throw new UserNotFoundException();
        }

        $this->userRepositoryInterface->delete($userId);
    }
}
