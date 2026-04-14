<?php

namespace App\Modules\Notifications\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Notifications\Application\Commands\EnqueueNotificationCommand;
use App\Modules\Notifications\Application\Commands\ProcessNextCommand;
use App\Modules\Notifications\Application\DTOs\EnqueueNotificationDTO;
use App\Modules\Notifications\Domain\Events\NotificationBroadcastedEvent;
use App\Modules\Notifications\Domain\Repositories\NotificationsRespositoryInterface;
use App\Modules\Notifications\Presentation\Http\Requests\EnqueueNotificationRequest;
use App\Modules\Notifications\Presentation\Http\Resources\EnqueueNotificationResource;
use App\Modules\Notifications\Presentation\Http\Resources\NotificationResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class NotificationController extends Controller
{
    public function __construct(
        private EnqueueNotificationCommand $enqueueNotificationCommand,
        private ProcessNextCommand $processNextCommand,
        private NotificationsRespositoryInterface $repo,
    ) {}

    public function enqueue(EnqueueNotificationRequest $request): JsonResponse
    {
        try {
            $authUserId = (string) $request->get('auth_user_id', '');
            $payloadUserId = $request->validated('userId');

            $dto = EnqueueNotificationDTO::fromArray([
                'userId' => $payloadUserId ?: $authUserId,
                'suceso' => $request->validated('suceso'),
                'channels' => $request->validated('channels'),
                'tone' => $request->validated('tone', 'PROFESIONAL'),
                'data' => $request->validated('data', []),
            ]);

            $notification = $this->enqueueNotificationCommand->execute($dto);

            return response()->json([
                'success' => true,
                'data' => new EnqueueNotificationResource($notification),
            ], 201);
        } catch (\Throwable $e) {
            Log::error('Notification error: ' . $e->getMessage(), ['exception' => $e]);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function processNext(): JsonResponse
    {
        try {
            $response = $this->processNextCommand->execute();

            return response()->json([
                'success' => true,
                'data' => $response->toArray(),
            ]);
        } catch (\RuntimeException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 404);
        } catch (\Throwable $e) {
            Log::error('Process notification error: ' . $e->getMessage(), ['exception' => $e]);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function myNotifications(Request $request): JsonResponse
    {
        $userId = (string) $request->get('auth_user_id', '');

        if ($userId === '') {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado',
            ], 401);
        }

        $notifications = $this->repo->findByUserId($userId);

        $data = array_map(
            fn($notification) => (new NotificationResource($notification))->toArray($request),
            $notifications
        );

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function notificationsByUser(Request $request, string $userId): JsonResponse
    {
        $authUserId = (string) $request->get('auth_user_id', '');

        if ($authUserId === '' || $authUserId !== $userId) {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado para consultar estas notificaciones',
            ], 403);
        }

        $notifications = $this->repo->findByUserId($userId);

        $data = array_map(
            fn($notification) => (new NotificationResource($notification))->toArray($request),
            $notifications
        );

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function markAsRead(Request $request, string $id): JsonResponse
    {
        $authUserId = (string) $request->get('auth_user_id', '');
        $notification = $this->repo->findById($id);

        if (!$notification) {
            return response()->json([
                'success' => false,
                'message' => 'Notificación no encontrada',
            ], 404);
        }

        if ($authUserId === '' || ($notification->userId !== null && $notification->userId !== $authUserId)) {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado para modificar esta notificación',
            ], 403);
        }

        $this->repo->readed($id);
        $updated = $this->repo->findById($id) ?? $notification;

        event(new NotificationBroadcastedEvent($updated, 'read'));

        return response()->json([
            'success' => true,
            'data' => (new NotificationResource($updated))->toArray($request),
        ]);
    }
}
