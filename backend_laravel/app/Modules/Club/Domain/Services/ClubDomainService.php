<?php

namespace App\Modules\Club\Domain\Services;

use App\Modules\Club\Domain\Repositories\ClubRepositoryInterface;
use App\Modules\Club\Domain\Repositories\EquipRepositoryInterface;
use App\Modules\Club\Domain\Repositories\EquipUsuariRepositoryInterface;

class ClubDomainService
{
    public function __construct(
        private ClubRepositoryInterface $clubRepository,
        private EquipRepositoryInterface $equipRepository,
        private EquipUsuariRepositoryInterface $equipUsuariRepository
    ) {}

    public function validateClubName(string $nom): void
    {
        if (strlen($nom) < 3) {
            throw new \Exception("El nom del club ha de tenir almenys 3 caràcters");
        }

        if (strlen($nom) > 255) {
            throw new \Exception("El nom del club no pot excedir 255 caràcters");
        }
    }

    public function validateEmail(?string $email): void
    {
        if (!$email) {
            return;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new \Exception("L'email '$email' no és vàlid");
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

    public function validateAnyFundacio(?int $anyFundacio): void
    {
        if ($anyFundacio === null) {
            return;
        }

        $currentYear = (int) date('Y');

        if ($anyFundacio < 1800) {
            throw new \Exception("L'any de fundació no pot ser anterior a 1800");
        }

        if ($anyFundacio > $currentYear) {
            throw new \Exception("L'any de fundació no pot ser posterior a l'any actual");
        }
    }

    public function validateEquipName(string $nom): void
    {
        if (strlen($nom) < 2) {
            throw new \Exception("El nom de l'equip ha de tenir almenys 2 caràcters");
        }

        if (strlen($nom) > 255) {
            throw new \Exception("El nom de l'equip no pot excedir 255 caràcters");
        }
    }

    public function validateEquipBelongsToClub(string $equipId, string $clubId): void
    {
        $equip = $this->equipRepository->findById($equipId);

        if (!$equip || $equip->clubId !== $clubId) {
            throw new \Exception("L'equip no pertany a aquest club");
        }
    }

    public function isUsuariAlreadyInEquip(string $equipId, string $usuariId): bool
    {
        $existing = $this->equipUsuariRepository->findByEquipIdAndUsuariId($equipId, $usuariId);
        return $existing !== null;
    }
}
