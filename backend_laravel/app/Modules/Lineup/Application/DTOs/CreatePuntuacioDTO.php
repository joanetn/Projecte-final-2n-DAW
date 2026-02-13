<?php
namespace App\Modules\Lineup\Application\DTOs;
class CreatePuntuacioDTO
{
    public function __construct(
        public readonly string $partitId,
        public readonly string $jugadorId,
        public readonly int $punts = 0
    ) {}
    public static function fromArray(array $data): self
    {
        return new self(
            partitId: $data['partitId'],
            jugadorId: $data['jugadorId'],
            punts: $data['punts'] ?? 0
        );
    }
}
