<?php

namespace App\Enums;

enum MerchBrand: string
{
    case BABOLAT = 'Babolat';
    case DUNLOP = 'Dunlop';
    case HEAD = 'Head';
    case NOX = 'Nox';
    case SIUX = 'Siux';

    /**
     * Get all brand values
     */
    public static function values(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }

    /**
     * Get all brands with label format
     */
    public static function options(): array
    {
        return array_map(fn($case) => [
            'value' => $case->value,
            'label' => $case->value,
        ], self::cases());
    }
}
