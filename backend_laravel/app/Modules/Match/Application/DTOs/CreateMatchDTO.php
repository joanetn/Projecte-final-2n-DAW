<?php

namespace App\Modules\Match\Application\DTOs;

class CreateMatchDTO
{
    public function __construct(
        public readonly ?string $jornadaId,
        public readonly string $localId,
        public readonly string $visitantId,
        public readonly ?string $dataHora,
        public readonly ?string $pistaId,
        public readonly ?string $arbitreId,
        public readonly ?string $status = 'PENDENT'
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            jornadaId: $data['jornadaId'] ?? null,
            localId: $data['localId'],
            visitantId: $data['visitantId'],
            dataHora: $data['dataHora'] ?? null,
            pistaId: $data['pistaId'] ?? null,
            arbitreId: $data['arbitreId'] ?? null,
            status: $data['status'] ?? 'PENDENT'
        );
    }
}
