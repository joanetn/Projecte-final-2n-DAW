<?php

namespace App\Modules\Venue\Domain\Services;

use App\Modules\Venue\Domain\Repositories\InstalacioRepositoryInterface;
use App\Modules\Venue\Domain\Repositories\PistaRepositoryInterface;

class VenueDomainService
{
    public function __construct(
        private InstalacioRepositoryInterface $instalacioRepository,
        private PistaRepositoryInterface $pistaRepository
    ) {}

    public function validateInstalacioName(string $nom): void
    {
        if (strlen($nom) < 2) {
            throw new \Exception("El nom de la instal·lació ha de tenir almenys 2 caràcters");
        }

        if (strlen($nom) > 255) {
            throw new \Exception("El nom de la instal·lació no pot excedir 255 caràcters");
        }
    }

    public function validatePhone(?string $phone): void
    {
        if (!$phone) {
            return;
        }

        $cleanPhone = preg_replace('/[^\d+]/', '', $phone);

        if (strlen($cleanPhone) < 9) {
            throw new \Exception("El telèfon ha de tenir almenys 9 dígits");
        }

        if (strlen($cleanPhone) > 15) {
            throw new \Exception("El telèfon no pot tenir més de 15 dígits");
        }
    }

    public function validateNumPistes(?int $numPistes): void
    {
        if ($numPistes === null) {
            return;
        }

        if ($numPistes < 0) {
            throw new \Exception("El número de pistes no pot ser negatiu");
        }

        if ($numPistes > 100) {
            throw new \Exception("El número de pistes no pot excedir 100");
        }
    }

    public function validatePistaName(string $nom): void
    {
        if (strlen($nom) < 1) {
            throw new \Exception("El nom de la pista ha de tenir almenys 1 caràcter");
        }

        if (strlen($nom) > 255) {
            throw new \Exception("El nom de la pista no pot excedir 255 caràcters");
        }
    }

    public function validatePistaBelongsToInstalacio(string $pistaId, string $instalacioId): void
    {
        $pista = $this->pistaRepository->findById($pistaId);

        if (!$pista || $pista->instalacioId !== $instalacioId) {
            throw new \Exception("La pista no pertany a aquesta instal·lació");
        }
    }
}
