<?php

namespace App\Modules\Notifications\Domain\Repositories;

use App\Modules\Notifications\Domain\Entities\Notification;
use App\Enums\NotifStatus;

interface NotificationsRespositoryInterface
{
    public function findById(string $id): ?Notification;

    public function findByIdWithRelations(string $id, array $relations): ?Notification;

    public function findAll(): array;

    public function findAllWithRelations(array $relations): array;

    public function create(array $data): Notification;

    public function update(string $id, array $data): bool;

    public function updateStatus(string $id, NotifStatus $status): bool;

    public function readed(string $id): bool;

    public function findByUserId(string $userId): array;

    public function findByStatus(string $status): array;

    public function findMostAncient(): ?Notification;
}
