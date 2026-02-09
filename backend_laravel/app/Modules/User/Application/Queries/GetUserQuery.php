<?php

namespace App\Modules\User\Application\Queries;

use App\Modules\User\Domain\Entities\User;
use App\Modules\User\Domain\Exceptions\UserNotFoundException;
use App\Modules\User\Domain\Repositories\UserRepositoryInterface;

class GetUserQuery
{
    public function __construct(
        private UserRepositoryInterface $userRepositoryInterface
    ) {}

    public function execute(string $userId): User
    {
        $user = $this->userRepositoryInterface->findById($userId);

        if (!$user) {
            throw new UserNotFoundException();
        }

        return $user;
    }
}
