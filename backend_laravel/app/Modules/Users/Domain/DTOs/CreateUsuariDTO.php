<?php

namespace App\Modules\Users\Domain\DTOs;

class CreateUsuariDTO
{
    public function __construct(
        public string $nom,
        public string $email,
        public string $contrasenya,
        public ?string $telefon = null,
        public ?\DateTime $dataNaixement = null,
        public ?string $nivell = null,
        public ?string $avatar = null,
        public ?string $dni = null,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            nom: $data['nom'],
            email: $data['email'],
            contrasenya: $data['contrasenya'],
            telefon: $data['telefon'] ?? null,
            dataNaixement: isset($data['dataNaixement']) ? new \DateTime($data['dataNaixement']) : null,
            nivell: $data['nivell'] ?? null,
            avatar: $data['avatar'] ?? null,
            dni: $data['dni'] ?? null,
        );
    }
}
