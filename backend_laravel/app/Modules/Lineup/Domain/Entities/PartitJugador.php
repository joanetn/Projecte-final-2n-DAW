<?php
namespace App\Modules\Lineup\Domain\Entities;
class PartitJugador
{
    public function __construct(
        public readonly string $id,
        public readonly string $partitId,
        public readonly string $jugadorId,
        public readonly string $equipId,
        public readonly int $punts = 0,
        public readonly bool $isActive = true,
        public readonly ?object $partit = null,
        public readonly ?object $jugador = null,
        public readonly ?object $equip = null
    ) {}
    public function hasPunts(): bool
    {
        return $this->punts > 0;
    }
    public function isActive(): bool
    {
        return $this->isActive;
    }
}
