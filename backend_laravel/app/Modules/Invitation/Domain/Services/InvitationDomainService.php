<?php

namespace App\Modules\Invitation\Domain\Services;

use App\Modules\Invitation\Domain\Exceptions\InvalidInvitacioEstatException;
use App\Modules\Invitation\Domain\Exceptions\DuplicateInvitacioException;

class InvitationDomainService
{
    private const VALID_ESTATS = ['pendent', 'acceptada', 'rebutjada', 'cancelada'];

    public function validateEstat(string $estat): void
    {
        if (!in_array($estat, self::VALID_ESTATS)) {
            throw new InvalidInvitacioEstatException($estat);
        }
    }

    public function validateNoDuplicate(array $existingInvitacions, string $usuariId): void
    {
        foreach ($existingInvitacions as $invitacio) {
            if ($invitacio->usuariId === $usuariId && $invitacio->estat === 'pendent') {
                throw new DuplicateInvitacioException();
            }
        }
    }

    public function canChangeEstat(string $currentEstat, string $newEstat): bool
    {
        $transitions = [
            'pendent' => ['acceptada', 'rebutjada', 'cancelada'],
            'acceptada' => [],
            'rebutjada' => [],
            'cancelada' => [],
        ];

        return in_array($newEstat, $transitions[$currentEstat] ?? []);
    }
}
