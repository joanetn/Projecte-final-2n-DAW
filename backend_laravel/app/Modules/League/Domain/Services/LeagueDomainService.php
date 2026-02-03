<?php

namespace App\Modules\League\Domain\Services;

class LeagueDomainService
{
    public function calculatePoints(int $wins, int $losses): int
    {
        return ($wins * 3) + ($losses * 0);
    }

    public function canStartLeague(object $league): bool
    {
        return $league->status === 'DRAFT' && $league->teamCount >= 2;
    }

    public function calculateStandingPosition(array $standings, string $equipId): int
    {
        $position = 1;
        foreach ($standings as $standing) {
            if ($standing->equipId === $equipId) {
                return $position;
            }
            $position++;
        }
        return 0;
    }

    public function shouldUpdateStanding(object $match): bool
    {
        return $match->isCompletat() || $match->isCancelat();
    }
}
