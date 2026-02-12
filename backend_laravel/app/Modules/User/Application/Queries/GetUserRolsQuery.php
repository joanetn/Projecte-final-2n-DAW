<?php

namespace App\Modules\User\Application\Queries;

use App\Modules\User\Domain\Repositories\UserRolRepositoryInterface;

class GetUserRolsQuery
{
    public function __construct(
        private UserRolRepositoryInterface $userRolRepositoryInterface,
    ) {}

    public function execute(string $usuariId): array
    {
        return $this->userRolRepositoryInterface->findByUserId($usuariId);
    }
}
