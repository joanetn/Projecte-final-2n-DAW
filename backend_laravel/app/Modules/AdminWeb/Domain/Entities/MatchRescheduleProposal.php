<?php

namespace App\Modules\AdminWeb\Domain\Entities;

class MatchRescheduleProposal
{
    public function __construct(
        public readonly string $id,
        public readonly string $partitId,
        public readonly string $equipProposaId,
        public readonly ?string $equipProposaNom,
        public readonly string $equipReceptorId,
        public readonly ?string $equipReceptorNom,
        public readonly string $proposatPerUsuariId,
        public readonly ?string $proposatPerUsuariNom,
        public readonly string $dataHoraProposada,
        public readonly ?string $motiu,
        public readonly string $estat,
        public readonly ?string $respostaText,
        public readonly ?string $respostaPerUsuariId,
        public readonly ?string $respostaPerUsuariNom,
        public readonly ?string $respostaAt,
        public readonly ?string $createdAt,
        public readonly ?array $partit,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            id: (string) $data['id'],
            partitId: (string) $data['partitId'],
            equipProposaId: (string) $data['equipProposaId'],
            equipProposaNom: $data['equipProposaNom'] ?? null,
            equipReceptorId: (string) $data['equipReceptorId'],
            equipReceptorNom: $data['equipReceptorNom'] ?? null,
            proposatPerUsuariId: (string) $data['proposatPerUsuariId'],
            proposatPerUsuariNom: $data['proposatPerUsuariNom'] ?? null,
            dataHoraProposada: (string) $data['dataHoraProposada'],
            motiu: $data['motiu'] ?? null,
            estat: (string) $data['estat'],
            respostaText: $data['respostaText'] ?? null,
            respostaPerUsuariId: $data['respostaPerUsuariId'] ?? null,
            respostaPerUsuariNom: $data['respostaPerUsuariNom'] ?? null,
            respostaAt: $data['respostaAt'] ?? null,
            createdAt: $data['createdAt'] ?? null,
            partit: isset($data['partit']) && is_array($data['partit']) ? $data['partit'] : null,
        );
    }
}
