<?php

namespace App\Modules\Invitation\Domain\Entities;

class InvitacioEquip
{
    public function __construct(
        public readonly string $id,
        public readonly string $equipId,
        public readonly string $usuariId,
        public readonly ?string $missatge = null,
        public readonly ?string $estat = null,
        public readonly bool $isActive = true,
        public readonly ?string $createdAt = null,
        public readonly ?string $updatedAt = null,
        public readonly ?object $equip = null,
        public readonly ?object $usuari = null
    ) {}

    public function isPendent(): bool
    {
        return $this->estat === 'pendent';
    }

    public function isAcceptada(): bool
    {
        return $this->estat === 'acceptada';
    }

    public function isRebutjada(): bool
    {
        return $this->estat === 'rebutjada';
    }
}
