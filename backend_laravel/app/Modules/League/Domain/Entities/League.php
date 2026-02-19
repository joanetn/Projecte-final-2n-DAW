<?php

namespace App\Modules\League\Domain\Entities;

use App\Enums\LeagueCategory;

class League
{
    public function __construct(
        public readonly string $id,
        public readonly string $nom,
        public readonly LeagueCategory|string $categoria,
        public readonly string $dataInici,
        public readonly ?string $dataFi,
        public readonly string $status,
        public readonly bool $isActive = false,
        public readonly ?string $logo_url = null,
        public readonly string $createdAt,
        public readonly string $updatedAt,
        public readonly ?array $jornades = null,
        public readonly ?array $equips = null,
        public readonly ?array $classificacions = null,
    ) {}

    public function hasTeams(): bool
    {
        return $this->equips !== null && count($this->equips) > 0;
    }

    public function getTeamCount(): int
    {
        return $this->equips ? count($this->equips) : 0;
    }

    public function isNotStarted(): bool
    {
        return $this->status === 'NOT_STARTED';
    }

    public function isOnProgress(): bool
    {
        return $this->status === 'ON_PROGRESS';
    }

    public function isFinished(): bool
    {
        return $this->status === 'FINISHED';
    }

    public function isValidCategory(): bool
    {
        $validCategories = ['Senior', 'Junior', 'Cadet', 'Infantil', 'Aleví'];
        return in_array(strtoupper($this->categoria), $validCategories);
    }

    public function isValidStatus(): bool
    {
        $validStatus = ['NOT_STARTED', 'ON_PROGRESS', 'FINISHED'];
        return in_array(strtoupper($this->status), $validStatus);
    }

    public function isActive(): bool
    {
        return $this->isActive;
    }
}
