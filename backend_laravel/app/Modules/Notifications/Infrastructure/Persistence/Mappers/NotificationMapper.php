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

        // Handle status - it could be a string or already an enum
        if ($model->status instanceof NotifStatus) {
            $status = $model->status;
        } else {
            $status = NotifStatus::tryFrom($model->status) ?? NotifStatus::PENDENT;
        }

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
            'urgency' => $notification->urgencia,
            'data' => $notification->data,
            'status' => $notification->status->value ?? (string) $notification->status,
            'llegit' => $notification->llegit,
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
            'urgency' => $notification->urgencia,
            'data' => $notification->data,
            'status' => $notification->status->value ?? (string) $notification->status,
            'llegit' => $notification->llegit ? true : false,
        ];
    }
}
