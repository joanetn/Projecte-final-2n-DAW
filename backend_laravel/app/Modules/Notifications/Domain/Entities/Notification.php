<?php

namespace App\Modules\Notifications\Domain\Entities;

use App\Enums\NotifStatus;

class Notification
{
    public function __construct(
        public readonly string $id,
        public readonly ?string $userId,
        public readonly NotifStatus $status = NotifStatus::PENDENT,
        public readonly string $tone = 'PROFESIONAL',
        public readonly string $urgencia = 'NORMAL',
        public readonly string $suceso,
        public readonly bool $llegit = false,
        public readonly array $channels,
        public readonly array $data,
    ) {}
}
