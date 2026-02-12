<?php

namespace App\Modules\User\Infrastructure\Persistence\Mappers;

use App\Modules\User\Domain\Entities\UserRol;
use App\Modules\User\Infrastructure\Persistence\Eloquent\Models\UserRolModel;

class UserRolMapper
{
    public function toDomain(UserRolModel $model): UserRol
    {
        return new UserRol(
            id: $model->id,
            usuariId: $model->usuariId,
            rol: $model->rol,
            isActive: $model->isActive,
            createdAt: $model->createdAt,
        );
    }

    public function toModel(UserRol $entity): array
    {
        return [
            'id' => $entity->id,
            'usuariId' => $entity->usuariId,
            'rol' => $entity->rol,
            'isActive' => $entity->isActive,
            'createdAt' => $entity->createdAt,
        ];
    }
}
