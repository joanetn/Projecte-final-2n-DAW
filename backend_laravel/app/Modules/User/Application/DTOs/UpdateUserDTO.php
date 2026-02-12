<?php

namespace App\Modules\User\Application\DTOs;

class UpdateUserDTO
{
    public function __construct(
        public readonly ?string $nom = null,
        public readonly ?string $email = null,
        public readonly ?string $contrasenya = null,
        public readonly ?string $telefon = null,
        public readonly ?string $dataNaixement = null,
        public readonly ?string $avatar = null,
        public readonly ?string $dni = null,
        public readonly ?bool $isActive = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            nom: $data['nom'] ?? null,
            email: $data['email'] ?? null,
            contrasenya: $data['contrasenya'] ?? null,
            telefon: $data['telefon'] ?? null,
            dataNaixement: $data['dataNaixement'] ?? null,
            avatar: $data['avatar'] ?? null,
            dni: $data['dni'] ?? null,
            isActive: isset($data['isActive']) ? (bool) $data['isActive'] : null,
        );
    }
}
