<?php

namespace App\Modules\League\Domain\Services;

use App\Modules\League\Domain\Exceptions\InvalidLeagueDateException;

class LeagueDomainService
{
    public function calculatePoints(int $wins, int $losses): int
    {
        return ($wins * 3) + ($losses * 0);
    }

    public function canStartLeague(object $league): bool
    {
        return $league->status === 'NOT_STARTED' && $league->teamCount >= 2;
    }

    public function validLeagueIniDate(?string $dateHour): void
    {
        if ($dateHour === null) {
            return;
        }

        $date = new \DateTime($dateHour);
        $now = new \DateTime();

        if ($date < $now) {
            throw new InvalidLeagueDateException("La data de inici de la lliga no pot ser anterior a avui", $date);
        }
    }

    public function validLeagueEndDate(?string $dataInici, ?string $dataFi): void
    {
        if ($dataInici === null || $dataFi === null) {
            return;
        }

        $inici = new \DateTime($dataInici);
        $fi = new \DateTime($dataFi);
        $now = new \DateTime();

        if ($inici < $now || $fi < $now) {
            throw new InvalidLeagueDateException("Ninguna de les dates pot ser anterior a la de hui", $now);
        }

        if ($fi < $inici) {
            throw new InvalidLeagueDateException("La data de fi de la lliga no pot ser anterior a la d'inici", $fi);
        }
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

    // public function shouldUpdateStanding(object $match): bool
    // {
    //     return $match->isCompletat() || $match->isCancelat();
    // }
}
