<?php

namespace App\Enums;

enum NotifStatus: string
{
    case PENDENT = 'Pendent';

    case COMPLETADA = 'Completada';

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
