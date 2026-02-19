<?php

namespace App\Modules\User\Infrastructure\Persistence\Mappers;

use App\Modules\User\Domain\Entities\User;
use App\Modules\User\Infrastructure\Persistence\Eloquent\Models\UserModel;

class UserMapper
{
    public static function toDomain(UserModel $usuari): User
    {
        return new User(
            id: $usuari->id,
            nom: $usuari->nom,
            email: $usuari->email,
            telefon: $usuari->telefon,
            dataNaixement: $usuari->dataNaixement?->format('Y-m-d'),
            nivell: $usuari->nivell?->value,
            avatar: $usuari->avatar,
            dni: $usuari->dni,
            isActive: $usuari->isActive,
            createdAt: $usuari->created_at?->format('Y-m-d H:i:s'),
            updatedAt: $usuari->updated_at?->format('Y-m-d H:i:s'),
            rols: $usuari->relationLoaded('rols') ? $usuari->rols->toArray() : null,
            equipUsuaris: $usuari->relationLoaded('equipUsuaris') ? $usuari->equipUsuaris->toArray() : null,
            compras: $usuari->relationLoaded('compras') ? $usuari->compras->toArray() : null,
            seguros: $usuari->relationLoaded('seguros') ? $usuari->seguros->toArray() : null,
        );
    }

    public static function toArray(User $user): array
    {
        return [
            'id' => $user->id,
            'nom' => $user->nom,
            'email' => $user->email,
            'telefon' => $user->telefon,
            'dataNaixement' => $user->dataNaixement,
            'nivell' => $user->nivell,
            'avatar' => $user->avatar,
            'dni' => $user->dni,
            'isActive' => $user->isActive,
            'createdAt' => $user->createdAt,
            'updatedAt' => $user->updatedAt,
        ];
    }
}
