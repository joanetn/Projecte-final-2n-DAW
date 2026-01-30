<?php

namespace App\Modules\Users\Domain\DTOs;

class UsuariDTO
{
    public function __construct(
        public string $id,
        public string $nom,
        public string $email,
        public ?string $telefon = null,
        public ?\DateTime $dataNaixement = null,
        public ?string $nivell = null,
        public ?string $avatar = null,
        public ?string $dni = null,
        public bool $isActive = true,
        public ?\DateTime $created_at = null,
        public ?\DateTime $updated_at = null,
        public array $rols = [],
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            id: $data['id'],
            nom: $data['nom'],
            email: $data['email'],
            telefon: $data['telefon'] ?? null,
            dataNaixement: isset($data['dataNaixement']) ? new \DateTime($data['dataNaixement']) : null,
            nivell: $data['nivell'] ?? null,
            avatar: $data['avatar'] ?? null,
            dni: $data['dni'] ?? null,
            isActive: $data['isActive'] ?? true,
            created_at: isset($data['created_at']) ? new \DateTime($data['created_at']) : null,
            updated_at: isset($data['updated_at']) ? new \DateTime($data['updated_at']) : null,
            rols: $data['rols'] ?? [],
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'email' => $this->email,
            'telefon' => $this->telefon,
            'dataNaixement' => $this->dataNaixement?->format('Y-m-d H:i:s'),
            'nivell' => $this->nivell,
            'avatar' => $this->avatar,
            'dni' => $this->dni,
            'isActive' => $this->isActive,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
            'rols' => $this->rols,
        ];
    }
}
