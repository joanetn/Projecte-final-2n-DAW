<?php

namespace App\Modules\Insurance\Domain\Services;

use App\Modules\Insurance\Domain\Exceptions\InvalidInsuranceDateException;
use App\Modules\Insurance\Domain\Repositories\InsuranceRepositoryInterface;
use Carbon\Carbon;

class InsuranceDomainService
{
    public function __construct(
        private InsuranceRepositoryInterface $insuranceRepo
    ) {}

    public function validateExpirationDate(string $expirationDate): void
    {
        if ($expirationDate === null) {
            return;
        }

        try {
            $expiration = Carbon::createFromFormat('Y-m-d', $expirationDate);
        } catch (\Exception $e) {
            throw InvalidInsuranceDateException::insuranceDateExpired();
        }

        $today = Carbon::now();

        if ($expiration->isBefore($today)) {
            throw InvalidInsuranceDateException::insuranceDateExpired();
        }
    }

    public function calculateDays(string $expirationDate): int
    {
        $expiration = Carbon::createFromFormat('Y-m-d', $expirationDate);
        return $expiration->diffInDays(Carbon::now());
    }
}
