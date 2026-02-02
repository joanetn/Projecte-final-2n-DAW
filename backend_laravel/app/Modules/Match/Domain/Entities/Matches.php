<?php

namespace App\Modules\Match\Domain\Entities;

class Matches
{
    private function __construct(
        public readonly string $id,
        public readonly ?string $jornadaId,
        public readonly string $localId,
        public readonly string $visitantId,
        public readonly ?string $dataHora,
        public readonly ?string $pistaId,
        public readonly ?string $arbitreId,
        public readonly string $status,
        public readonly bool $isActive,
        public readonly string $createdAt,
        public readonly string $updatedAt,
        public readonly ?array $setPartits = null,
        public readonly ?object $local = null,
        public readonly ?object $visitant = null,
        public readonly ?object $jornada = null,
        public readonly ?object $pista = null,
        public readonly ?object $arbitre = null,
        public readonly ?object $acta = null,
        public readonly ?array $alineacions = null
    ) {}

    public function isPendent(): bool
    {
        return $this->status === 'PENDENT';
    }

    public function isCompletat(): bool
    {
        return $this->status === 'COMPLETAT';
    }

    public function isCancelat(): bool
    {
        return $this->status === 'CANCELAT';
    }

    public function hasArbitre(): bool
    {
        return $this->arbitreId !== null;
    }
}
