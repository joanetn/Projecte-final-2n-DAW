<?php

namespace App\Modules\League\Domain\Services;

use App\Modules\League\Domain\Entities\Standing;
use App\Modules\League\Domain\Exceptions\InvalidStandingException;

class StandingDomainService
{
    public function updateStandingAfterMatch(
        Standing $standing,
        int $setsWon,
        int $setsLost,
        int $gamesWon,
        int $gamesLost,
        bool $matchWon,
    ): array {
        $this->validateSets($setsWon, $setsLost);
        $this->validateGames($gamesWon, $gamesLost);

        $newPoints = $this->calculatePoints($standing->punts, $matchWon);

        return [
            'partitsJugats' => $standing->partitsJugats + 1,
            'partitsGuanyats' => $matchWon ? $standing->partitsGuanyats + 1 : $standing->partitsGuanyats,
            'setsGuanyats' => $standing->setsGuanyats + $setsWon,
            'setPerduts' => $standing->setPerduts + $setsLost,
            'jocsGuanyats' => $standing->jocsGuanyats + $gamesWon,
            'jocsPerduts' => $standing->jocsPerduts + $gamesLost,
            'punts' => $newPoints,
        ];
    }

    public function calculatePoints(int $currentPoints, bool $matchWon): int
    {
        if ($matchWon) {
            return $currentPoints + 3;
        }

        return $currentPoints;
    }

    public function validateSets(int $setsWon, int $setsLost): void
    {
        if ($setsWon < 0 || $setsLost < 0) {
            throw new InvalidStandingException('Els sets no poden ser negatius');
        }

        if ($setsWon > 3 || $setsLost > 3) {
            throw new InvalidStandingException('Un equip no pot guanyar o perdre més de 3 sets');
        }
    }

    public function validateGames(int $gamesWon, int $gamesLost): void
    {
        if ($gamesWon < 0 || $gamesLost < 0) {
            throw new InvalidStandingException('Els jocs no poden ser negatius');
        }
    }

    public function calculateSetDifference(Standing $standing): int
    {
        return $standing->setsGuanyats - $standing->setPerduts;
    }

    public function calculateGameDifference(Standing $standing): int
    {
        return $standing->jocsGuanyats - $standing->jocsPerduts;
    }

    public function validateTeamCanJoinLeague(bool $teamAlreadyInLeague): void
    {
        if ($teamAlreadyInLeague) {
            throw new InvalidStandingException('Aquest equip ja està inscrit a la lliga');
        }
    }

    public function validateCanDeactivate(Standing $standing): void
    {
        if ($standing->partitsJugats > 0) {
            throw new InvalidStandingException('No es pot desactivar un standing amb partits jugats');
        }
    }

    public function getResetStats(): array
    {
        return [
            'partitsJugats' => 0,
            'partitsGuanyats' => 0,
            'setsGuanyats' => 0,
            'setPerduts' => 0,
            'jocsGuanyats' => 0,
            'jocsPerduts' => 0,
            'punts' => 0,
        ];
    }
}
