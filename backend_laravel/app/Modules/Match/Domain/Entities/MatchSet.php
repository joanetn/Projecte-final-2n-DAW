<?php

namespace App\Modules\Match\Domain\Entities;

class MatchSet
{
    public function __construct(
        public readonly string $id,
        public readonly string $partitId,
        public readonly int $numeroSet,
        public readonly ?int $jocsLocal,
        public readonly ?int $jocsVisit,
        public readonly bool $tiebreak,
        public readonly ?int $puntsLocalTiebreak,
        public readonly ?int $puntsVisitTiebreak
    ) {}

    public function getWinner(): ?string
    {
        if ($this->jocsLocal === null || $this->jocsVisit === null) {
            return null;
        }

        if ($this->tiebreak && $this->puntsLocalTiebreak !== null && $this->puntsVisitTiebreak !== null) {
            return $this->puntsLocalTiebreak > $this->puntsVisitTiebreak ? 'local' : 'visitant';
        }

        return $this->jocsLocal > $this->jocsVisit ? 'local' : 'visitant';
    }
}
