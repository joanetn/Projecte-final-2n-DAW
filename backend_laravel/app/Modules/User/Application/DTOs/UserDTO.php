<?php

namespace App\Modules\User\Application\DTOs;

use App\Modules\User\Domain\Entities\User;

class UserDTO
{
    public function __construct(
        public readonly string $id,
        public readonly string $nom,
        public readonly string $email,
        public readonly ?string $telefon = null,
        public readonly ?string $dataNaixement = null,
        public readonly ?string $avatar = null,
        public readonly ?string $dni = null,
        public readonly bool $isActive = true,
        public readonly string $createdAt,
        public readonly string $updatedAt,
    ) {}

    public static function fromEntity(User $user): self
    {
        return new self(
            id: $user->id,
            nom: $user->nom,
            email: $user->email,
            telefon: $user->telefon,
            dataNaixement: $user->dataNaixement,
            avatar: $user->avatar,
            dni: $user->dni,
            isActive: $user->isActive,
            createdAt: $user->createdAt ?? date('Y-m-d H:i:s'),
            updatedAt: $user->updatedAt ?? date('Y-m-d H:i:s'),
        );
    }
}
