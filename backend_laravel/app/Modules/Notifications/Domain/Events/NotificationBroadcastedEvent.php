<?php

namespace App\Modules\Notifications\Domain\Events;

use App\Modules\Notifications\Domain\Entities\Notification;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NotificationBroadcastedEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly Notification $notification,
        public readonly string $action = 'updated',
        public readonly array $meta = [],
    ) {}

    public function broadcastOn(): array
    {
        if ($this->notification->userId) {
            return [new Channel('notifications.user.' . $this->notification->userId)];
        }

        return [new Channel('notifications.public')];
    }

    public function broadcastAs(): string
    {
        return 'notification.' . $this->action;
    }

    public function broadcastWith(): array
    {
        return [
            'action' => $this->action,
            'notification' => [
                'id' => $this->notification->id,
                'userId' => $this->notification->userId,
                'suceso' => $this->notification->suceso,
                'status' => $this->notification->status->value,
                'tone' => $this->notification->tone,
                'urgencia' => $this->notification->urgencia,
                'llegit' => $this->notification->llegit,
                'channels' => $this->notification->channels,
                'data' => $this->notification->data,
                'createdAt' => $this->notification->createdAt,
                'updatedAt' => $this->notification->updatedAt,
            ],
            'meta' => $this->meta,
            'broadcastedAt' => now()->toIso8601String(),
        ];
    }
}
