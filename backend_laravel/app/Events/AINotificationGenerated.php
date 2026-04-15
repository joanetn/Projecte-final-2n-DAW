<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Queue\SerializesModels;

class AINotificationGenerated implements ShouldBroadcastNow
{
    use SerializesModels;

    public array $notification;

    public function __construct(array $notification)
    {
        $this->notification = $notification;
    }

    public function broadcastOn(): PrivateChannel
    {
        $userId = (string) ($this->notification['user_id'] ?? '');

        return new PrivateChannel('user.' . $userId);
    }

    public function broadcastAs(): string
    {
        return 'ai.notification';
    }
}
