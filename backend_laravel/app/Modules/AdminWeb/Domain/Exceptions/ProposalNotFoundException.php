<?php

namespace App\Modules\AdminWeb\Domain\Exceptions;

use DomainException;

class ProposalNotFoundException extends DomainException
{
    public static function byId(string $proposalId): self
    {
        return new self("Propuesta no encontrada: {$proposalId}", 404);
    }
}
