<?php
namespace App\Modules\Lineup\Application\DTOs;
class CreateAlineacioDTO
{
    public function __construct(
        public readonly string $partitId,
        public readonly string $jugadorId,
        public readonly string $equipId,
        public readonly ?string $posicio = null
    ) {}
    public static function fromArray(array $data): self
    {
        return new self(
            partitId: $data['partitId'],
            jugadorId: $data['jugadorId'],
            equipId: $data['equipId'],
            posicio: $data['posicio'] ?? null
        );
    }
}
