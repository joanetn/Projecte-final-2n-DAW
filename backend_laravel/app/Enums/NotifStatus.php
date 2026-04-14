<?php

namespace App\Enums;

enum NotifStatus: string
{
    case PENDENT = 'PENDENT';

    case COMPLETADA = 'COMPLETADA';

    case ERROR = 'ERROR';

    public static function fromString(?string $value): self
    {
        if ($value === null || trim($value) === '') {
            return self::PENDENT;
        }

        $normalized = strtoupper(trim($value));

        return match ($normalized) {
            'PENDENT', 'PENDENTE' => self::PENDENT,
            'COMPLETADA', 'COMPLETED' => self::COMPLETADA,
            'ERROR', 'FAILED', 'FALLIDA' => self::ERROR,
            default => self::tryFrom($normalized) ?? self::PENDENT,
        };
    }

    public static function values(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }

    public static function options(): array
    {
        return array_map(fn($case) => [
            'value' => $case->value,
            'label' => $case->value,
        ], self::cases());
    }
}
