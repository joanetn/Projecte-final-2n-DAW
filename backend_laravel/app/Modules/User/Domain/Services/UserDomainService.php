<?php

namespace App\Modules\User\Domain\Services;

use App\Modules\User\Domain\Exceptions\InvalidDateBirthException;
use App\Modules\User\Domain\Repositories\UserRepositoryInterface;
use Carbon\Carbon;

class UserDomainService
{
    private const MIN_AGE = 13;
    private const MIN_PASSWORD_LENGTH = 8;

    public function __construct(
        private UserRepositoryInterface $userRepository
    ) {}

    public function validateBirthDate(string $birthDate): void
    {
        if ($birthDate === null) {
            return;
        }

        try {
            $birth = Carbon::createFromFormat('Y-m-d', $birthDate);
        } catch (\Exception $e) {
            throw InvalidDateBirthException::birthDateInFuture($birthDate);
        }

        $today = Carbon::now();

        if ($birth->isAfter($today)) {
            throw InvalidDateBirthException::birthDateInFuture($birthDate);
        }

        $age = $birth->diffInYears($today);
        if ($age < self::MIN_AGE) {
            throw InvalidDateBirthException::userTooYoung(self::MIN_AGE);
        }
    }

    public function calculateAge(string $birthDate): int
    {
        $birth = Carbon::createFromFormat('Y-m-d', $birthDate);
        return $birth->diffInYears(Carbon::now());
    }

    public function validateEmail(string $email, ?string $excludeUserId = null): void
    {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new \Exception("L'email '$email' no és vàlid");
        }

        $existingUser = $this->userRepository->findByEmail($email);
        if ($existingUser && (!$excludeUserId)) {
            throw new \Exception("L'email '$email' ja està registrat");
        }
    }

    public function validatePassword(string $password): void
    {
        if (strlen($password) < self::MIN_PASSWORD_LENGTH) {
            throw new \Exception("La contrasenya ha de tenir almenys " . self::MIN_PASSWORD_LENGTH . " caràcters");
        }

        if (!preg_match('/[A-Z]/', $password)) {
            throw new \Exception("La contrasenya ha de tenir almenys una lletra majúscula");
        }

        if (!preg_match('/[a-z]/', $password)) {
            throw new \Exception("La contrasenya ha de tenir almenys una lletra minúscula");
        }

        if (!preg_match('/[0-9]/', $password)) {
            throw new \Exception("La contrasenya ha de tenir almenys un número");
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

    public function validateName(string $name): void
    {
        if (strlen($name) < 5) {
            throw new \Exception("El nom ha de tenir almenys 5 caràcters (nom + primer cognom)");
        }

        if (strlen($name) > 255) {
            throw new \Exception("El nom no pot excedir 255 caràcters");
        }

        if (!preg_match('/^[a-zA-Z\s]+$/', $name)) {
            throw new \Exception("El nom pot contenir només lletres i espais");
        }

        $words = array_filter(explode(' ', trim($name)));
        if (count($words) < 2) {
            throw new \Exception("El nom ha de tindre nom i primer cognom (almenys 2 paraules)");
        }
    }

    public function canUserBeCreated(string $email): bool
    {
        $existingUser = $this->userRepository->findByEmail($email);
        return $existingUser !== null;
    }
}
