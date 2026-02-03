<?php

namespace App\Modules\League\Domain\Entities;

class League
{
    private function __construct(
        public readonly string $id,
        public readonly string $nom,
        public readonly string $categoria,
        public readonly bool $isActive,
        public readonly string $createdAt,
        public readonly string $updatedAt,
        public readonly ?array $jornades = null,
        public readonly ?array $equips = null,
        public readonly ?array $classificacions = null
    ) {}

    public function hasTeams(): bool
    {
        return $this->equips !== null && count($this->equips) > 0;
    }

    public function getTeamCount(): int
    {
        return $this->equips ? count($this->equips) : 0;
    }

    public function isValidCategory(): bool
    {
        $validCategories = ['SENIOR', 'JUNIOR', 'CADET', 'INFANTIL', 'ALEVÍ'];
        return in_array(strtoupper($this->categoria), $validCategories);
    }

    public function isActive(): bool
    {
        return $this->isActive;
    }
}
