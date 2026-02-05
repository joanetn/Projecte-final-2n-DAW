<?php

namespace App\Modules\League\Domain\Services;

use App\Modules\League\Domain\Exceptions\InvalidRoundDateException;

class RoundDomainService
{
    public function validRoundIniDate(?string $dataInici): void
    {
        if ($dataInici === null) {
            return;
        }

        $date =  new \DateTime($dataInici);
        $now = new \DateTime();

        if ($date < $now) {
            throw new InvalidRoundDateException("La data de inici de la jornada no pot ser anterior a avui", $date);
        }
    }

    public function validRoundEndDate(?string $dataInici, ?string $dataFi): void
    {
        if ($dataInici === null || $dataFi === null) {
            return;
        }

        $inici = new \DateTime($dataInici);
        $fi = new \DateTime($dataFi);
        $now = new \DateTime();

        if ($inici < $now || $fi < $now) {
            throw new InvalidRoundDateException("Ninguna de les dates pot ser anterior a la de hui", $now);
        }

        if ($fi < $inici) {
            throw new InvalidRoundDateException("La data de fi de la jornada no pot ser anterior a la d'inici", $fi);
        }
    }
}
