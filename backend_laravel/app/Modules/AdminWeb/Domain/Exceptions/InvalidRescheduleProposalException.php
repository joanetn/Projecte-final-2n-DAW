<?php

namespace App\Modules\AdminWeb\Domain\Exceptions;

use DomainException;

class InvalidRescheduleProposalException extends DomainException
{
    public static function insufficientTeams(): self
    {
        return new self('Calen com a mínim 2 equips actius per generar partits', 422);
    }

    public static function fixturesAlreadyGenerated(): self
    {
        return new self('La lliga ja té partits generats. Confirma re-randomitzar amb force=true', 422);
    }

    public static function matchNotFound(): self
    {
        return new self('Partido no encontrado', 404);
    }

    public static function userCannotSendProposal(): self
    {
        return new self('Solo el admin del equipo puede enviar propuestas de cambio', 422);
    }

    public static function pendingProposalExists(): self
    {
        return new self('Ya existe una propuesta pendiente para este partido', 422);
    }

    public static function sameDateTime(): self
    {
        return new self('La fecha propuesta debe ser distinta a la actual', 422);
    }

    public static function proposalAlreadyAnswered(): self
    {
        return new self('La propuesta ya fue respondida', 422);
    }

    public static function userCannotRespondProposal(): self
    {
        return new self('Solo el admin del equipo receptor puede responder esta propuesta', 422);
    }

    public static function invalidAction(): self
    {
        return new self('Acción inválida. Usa ACCEPTAR o RECHAZAR', 422);
    }
}
