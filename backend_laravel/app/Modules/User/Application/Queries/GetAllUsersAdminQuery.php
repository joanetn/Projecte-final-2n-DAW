<?php

namespace App\Modules\User\Application\Queries;

use App\Modules\User\Domain\Repositories\UserRepositoryInterface;

class GetAllUsersAdminQuery
{
    public function __construct(
        private UserRepositoryInterface $userRepositoryInterface
    ) {}

    public function execute(): array
    {
        return $this->userRepositoryInterface->findAllIncludingInactiveWithRelations([
            'rols',
            'equipUsuaris',
            'compras',
            'seguros'
        ]);
    }
}
