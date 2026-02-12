<?php

namespace App\Modules\User\Application\DTOs;

class CreateUserDTO
{
    public function __construct(
        public readonly string $nom,
        public readonly string $email,
        public readonly string $contrasenya,
        public readonly ?string $telefon = null,
        public readonly ?string $dataNaixement = null,
        public readonly ?string $avatar = null,
        public readonly ?string $dni = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            nom: $data['nom'],
            email: $data['email'],
            contrasenya: $data['contrasenya'],
            telefon: $data['telefon'] ?? null,
            dataNaixement: $data['dataNaixement'] ?? null,
            avatar: $data['avatar'] ?? null,
            dni: $data['dni'] ?? null,
        );
    }
}
