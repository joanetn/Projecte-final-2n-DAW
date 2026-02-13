<?php
namespace App\Modules\Lineup\Application\DTOs;
use App\Modules\Lineup\Domain\Entities\Alineacio;
class AlineacioDTO
{
    public function __construct(
        public readonly string $id,
        public readonly string $partitId,
        public readonly string $jugadorId,
        public readonly string $equipId,
        public readonly ?string $posicio,
        public readonly bool $isActive,
        public readonly ?string $creadaAt
    ) {}
    public static function fromEntity(Alineacio $alineacio): self
    {
        return new self(
            id: $alineacio->id,
            partitId: $alineacio->partitId,
            jugadorId: $alineacio->jugadorId,
            equipId: $alineacio->equipId,
            posicio: $alineacio->posicio,
            isActive: $alineacio->isActive,
            creadaAt: $alineacio->creadaAt
        );
    }
}
