<?php

namespace App\Modules\League\Domain\Entities;

class Round
{
    private function __construct(
        public readonly string $id,
        public readonly string $nom,
        public readonly string $lligaId,
        public readonly string $dataInici,
        public readonly ?string $dataFi = null,
        public readonly string $status = 'PENDENT',
        public readonly bool $isActive = true,
        public readonly string $createdAt,
        public readonly string $updatedAt,
        public readonly ?array $partits = null,
    ) {}

    public function isPendent(): bool
    {
        return $this->status === 'PENDENT';
    }

    public function isOnProgress(): bool
    {
        return $this->status === 'ON_PROGRESS';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'COMPLETED';
    }

    public function isActive(): bool
    {
        return $this->isActive;
    }
}
