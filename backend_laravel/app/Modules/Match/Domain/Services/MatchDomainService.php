<?php

namespace Modules\Match\Domain\Services;

use Modules\Match\Domain\Entities\Matches;
use Modules\Match\Domain\Exceptions\InvalidMatchDateException;

class MatchDomainService
{
    public function validateMatchDate(?string $dateHour): void
    {
        if ($dateHour === null) {
            return;
        }

        $date = new \DateTime($dateHour);
        $now = new \DateTime();

        if ($date < $now) {
            throw new InvalidMatchDateException("La data del partit no pot ser anterior a avui");
        }
    }

    public function canAssignArbitre(Matches $partit): bool
    {
        return $partit->isPendent() && !$partit->hasArbitre();
    }

    public function canUpdateMatch(Matches $partit): bool
    {
        return !$partit->isCompletat() && !$partit->isCancelat();
    }

    public function calculateSetWinner(int $localGames, int $visitGames, bool $tiebreak = false, ?int $localPointsTiebreak = null, ?int $visitPointsTiebreak = null): string
    {
        if ($tiebreak && $localPointsTiebreak !== null && $visitPointsTiebreak !== null) {
            return $localPointsTiebreak > $visitPointsTiebreak ? 'local' : 'visitant';
        }

        return $localGames > $visitGames ? 'local' : 'visitant';
    }
}