<?php

namespace App\Enums;

enum UserLevel: string
{
    case PRINCIPANT = 'principant';
    case INTERMEDI = 'intermedi';
    case AVANCAT = 'avançat';

    /**
     * Get all level values
     */
    public static function values(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }

    /**
     * Get all levels with label format
     */
    public static function options(): array
    {
        return array_map(fn($case) => [
            'value' => $case->value,
            'label' => ucfirst($case->value),
        ], self::cases());
    }
}
