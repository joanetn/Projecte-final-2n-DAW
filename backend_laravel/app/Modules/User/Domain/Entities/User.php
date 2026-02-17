<?php

namespace App\Modules\User\Domain\Entities;

class User
{
    public function __construct(
        public readonly string $id,
        public readonly string $nom,
        public readonly string $email,
        public readonly ?string $telefon = null,
        public readonly ?string $dataNaixement = null,
        public readonly ?string $nivell = null,
        public readonly ?string $avatar = null,
        public readonly ?string $dni = null,
        public readonly bool $isActive = true,
        public readonly ?string $createdAt = null,
        public readonly ?string $updatedAt = null,
        public readonly ?array $rols = null,
        public readonly ?array $equipUsuaris = null,
        public readonly ?array $compras = null,
        public readonly ?array $seguros = null,
    ) {}
}
