<?php

namespace Modules\Match\Application\DTOs;

class UpdateMatchDTO
{
    public function __construct(
        public readonly ?string $jornadaId = null,
        public readonly ?string $localId = null,
        public readonly ?string $visitantId = null,
        public readonly ?string $dataHora = null,
        public readonly ?string $pistaId = null,
        public readonly ?string $arbitreId = null,
        public readonly ?string $status = null
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            jornadaId: $data['jornadaId'] ?? null,
            localId: $data['localId'] ?? null,
            visitantId: $data['visitantId'] ?? null,
            dataHora: $data['dataHora'] ?? null,
            pistaId: $data['pistaId'] ?? null,
            arbitreId: $data['arbitreId'] ?? null,
            status: $data['status'] ?? null
        );
    }
}