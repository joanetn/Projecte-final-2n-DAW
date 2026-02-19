<?php

namespace App\Enums;

enum LeagueCategory: string
{
    case SENIOR = 'Senior';
    case JUNIOR = 'Junior';
    case CADET = 'Cadet';
    case INFANTIL = 'Infantil';
    case ALEVI = 'Aleví';

    /**
     * Get all category values
     */
    public static function values(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }

    /**
     * Get all categories with label format
     */
    public static function options(): array
    {
        return array_map(fn($case) => [
            'value' => $case->value,
            'label' => $case->value,
        ], self::cases());
    }
}
