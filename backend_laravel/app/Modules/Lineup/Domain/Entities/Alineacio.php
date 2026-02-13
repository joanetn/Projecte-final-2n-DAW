<?php
namespace App\Modules\Lineup\Domain\Entities;
class Alineacio
{
    public function __construct(
        public readonly string $id,
        public readonly string $partitId,
        public readonly string $jugadorId,
        public readonly string $equipId,
        public readonly ?string $posicio,
        public readonly bool $isActive = true,
        public readonly ?string $creadaAt = null,
        public readonly ?object $partit = null,
        public readonly ?object $jugador = null,
        public readonly ?object $equip = null
    ) {}
    public function isActive(): bool
    {
        return $this->isActive;
    }
    public function hasPosicio(): bool
    {
        return $this->posicio !== null;
    }
}
