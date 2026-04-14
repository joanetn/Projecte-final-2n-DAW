<?php

namespace App\Modules\Notifications\Infrastructure\Persistence\Mappers;

use App\Modules\Notifications\Domain\Entities\Notification;
use App\Modules\Notifications\Infrastructure\Persistence\Eloquent\Models\NotificationModel;
use App\Enums\NotifStatus;

class NotificationMapper
{
    public static function toEntity(NotificationModel $model): Notification
    {
        $channels = is_array($model->channels) ? $model->channels : [];
        $data = is_array($model->data) ? $model->data : [];

        $rawStatus = $model->status instanceof NotifStatus
            ? $model->status->value
            : (is_string($model->status) ? $model->status : null);

        $status = NotifStatus::fromString($rawStatus);

        return new Notification(
            id: $model->id,
            userId: $model->user_id,
            status: $status,
            tone: $model->tone ?? 'PROFESIONAL',
            urgencia: $model->urgencia ?? 'NORMAL',
            suceso: $model->suceso ?? '',
            llegit: (bool) $model->llegit,
            channels: $channels,
            data: $data,
            createdAt: $model->created_at?->toIso8601String(),
            updatedAt: $model->updated_at?->toIso8601String(),
        );
    }

    public static function toArray(Notification $notification): array
    {
        return [
            'id' => $notification->id,
            'user_id' => $notification->userId,
            'suceso' => $notification->suceso,
            'channels' => $notification->channels,
            'tone' => $notification->tone,
            'urgencia' => $notification->urgencia,
            'data' => $notification->data,
            'status' => $notification->status->value ?? (string) $notification->status,
            'llegit' => $notification->llegit,
            'created_at' => $notification->createdAt,
            'updated_at' => $notification->updatedAt,
        ];
    }

    public static function toRecord(Notification $notification): array
    {
        return [
            'id' => $notification->id,
            'user_id' => $notification->userId,
            'suceso' => $notification->suceso,
            'channels' => $notification->channels,
            'tone' => $notification->tone,
            'urgencia' => $notification->urgencia,
            'data' => $notification->data,
            'status' => $notification->status->value ?? (string) $notification->status,
            'llegit' => $notification->llegit ? true : false,
        ];
    }
}
