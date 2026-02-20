<?php

namespace App\Modules\Auth\Application\Queries;

use App\Modules\Auth\Infrastructure\Persistence\Eloquent\Repositories\EloquentAuthRepository;

class GetActiveSessionsQuery
{
    public function __construct(
        private EloquentAuthRepository $authRepo,
    ) {}

    public function execute(string $userId): array
    {
        return $this->authRepo->findAllUserDevices($userId);
    }
}
