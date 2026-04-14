<?php

namespace App\Modules\Notifications\Infrastructure\Persistence\Eloquent\Repositories;

use App\Modules\Notifications\Domain\Entities\Notification;
use App\Modules\Notifications\Infrastructure\Persistence\Eloquent\Models\NotificationModel;
use App\Modules\Notifications\Infrastructure\Persistence\Mappers\NotificationMapper;
use App\Enums\NotifStatus;
use App\Modules\Notifications\Domain\Repositories\NotificationsRespositoryInterface;

class EloquentNotificationRepository implements NotificationsRespositoryInterface
{
    public function __construct(
        private NotificationModel $model,
        private NotificationMapper $mapper
    ) {}

    public function findById(string $id): ?Notification
    {
        $model = $this->model->find($id);

        return $model ? $this->mapper->toEntity($model) : null;
    }

    public function findByIdWithRelations(string $id, array $relations): ?Notification
    {
        $model = $this->model
            ->with($relations)
            ->find($id);

        return $model ? $this->mapper->toEntity($model) : null;
    }

    public function findAll(): array
    {
        $models = $this->model
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map([$this->mapper, 'toEntity'])->toArray();
    }

    public function findAllWithRelations(array $relations): array
    {
        $models = $this->model
            ->with($relations)
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map([$this->mapper, 'toEntity'])->toArray();
    }

    public function findByStatus(string $status): array
    {
        $models = $this->model
            ->whereRaw('UPPER(status) = ?', [strtoupper($status)])
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map([$this->mapper, 'toEntity'])->toArray();
    }

    public function findByUserId(string $userId): array
    {
        $models = $this->model
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map([$this->mapper, 'toEntity'])->toArray();
    }

    public function create(array $data): Notification
    {
        $model = $this->model->create($data);

        return $this->mapper->toEntity($model);
    }

    public function updateStatus(string $id, NotifStatus $status): bool
    {
        return (bool) $this->model
            ->where('id', $id)
            ->update(['status' => $status->value]);
    }

    public function readed(string $id): bool
    {
        return (bool) $this->model
            ->where('id', $id)
            ->update(['llegit' => true]);
    }

    public function findMostAncient(): ?Notification
    {
        $model = $this->model
            ->whereIn('status', [NotifStatus::PENDENT->value, 'Pendent'])
            ->orderBy('created_at', 'asc')
            ->first();

        return $model ? $this->mapper->toEntity($model) : null;
    }

    public function update(string $id, array $data): bool
    {
        return (bool) $this->model
            ->where('id', $id)
            ->update($data);
    }
}
