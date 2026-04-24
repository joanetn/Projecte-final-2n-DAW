<?php

namespace App\Modules\Notifications\Presentation\Http\Controllers;

use App\Events\AINotificationGenerated;
use App\Http\Controllers\Controller;
use App\Modules\Notifications\Application\Commands\EnqueueNotificationCommand;
use App\Modules\Notifications\Application\Commands\ProcessNextCommand;
use App\Modules\Notifications\Application\DTOs\EnqueueNotificationDTO;
use App\Modules\Notifications\Application\Services\NotificationSmsSender;
use App\Modules\Notifications\Domain\Entities\Notification;
use App\Modules\Notifications\Domain\Repositories\NotificationsRespositoryInterface;
use App\Modules\Notifications\Presentation\Http\Requests\EnqueueNotificationRequest;
use App\Modules\Notifications\Presentation\Http\Resources\EnqueueNotificationResource;
use App\Modules\Notifications\Presentation\Http\Resources\NotificationResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use Twilio\TwiML\MessagingResponse;

class NotificationController extends Controller
{
    public function __construct(
        private EnqueueNotificationCommand $enqueueNotificationCommand,
        private ProcessNextCommand $processNextCommand,
        private NotificationsRespositoryInterface $repo,
        private NotificationSmsSender $notificationSmsSender,
    ) {}

    public function whatsappResponse()
    {
        $response = new MessagingResponse();
        $message = $response->message('');
        $message->body('Yepa ya estoy por aqui');
        $response->redirect('https://demo.twilio.com/welcome/sms/');

        echo $response;
    }

    public function sendSms(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'phone' => ['required', 'string', 'max:30'],
                'message' => ['nullable', 'string', 'max:5000', 'required_without:contentSid'],
                'contentSid' => ['sometimes', 'nullable', 'string', 'max:120'],
                'contentVariables' => ['sometimes', 'array'],
                'referenceId' => ['sometimes', 'nullable', 'string', 'max:191'],
                'channel' => ['sometimes', 'nullable', 'string', 'in:sms,whatsapp'],
            ]);

            $channelOverride = isset($validated['channel'])
                ? strtolower(trim((string) $validated['channel']))
                : null;

            if ($channelOverride === null && str_contains(strtolower((string) $request->path()), 'whatsapp/send')) {
                $channelOverride = 'whatsapp';
            }

            $result = $this->notificationSmsSender->sendDirect(
                (string) $validated['phone'],
                isset($validated['message']) ? (string) $validated['message'] : '',
                isset($validated['referenceId']) ? trim((string) $validated['referenceId']) : null,
                isset($validated['contentSid']) ? trim((string) $validated['contentSid']) : null,
                is_array($validated['contentVariables'] ?? null) ? $validated['contentVariables'] : [],
                $channelOverride,
            );

            return response()->json([
                'success' => true,
                'data' => $result,
            ], 201);
        } catch (ValidationException $validationException) {
            return response()->json([
                'success' => false,
                'message' => 'Payload inválido para envío Twilio',
                'errors' => $validationException->errors(),
            ], 422);
        } catch (\Throwable $e) {
            Log::error('Direct Twilio send error: ' . $e->getMessage(), ['exception' => $e]);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function enqueue(EnqueueNotificationRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $authUserId = (string) $request->get('auth_user_id', '');
            $payloadUserId = trim((string) ($validated['userId'] ?? ''));
            $payloadUserIds = is_array($validated['userIds'] ?? null)
                ? $validated['userIds']
                : [];

            if ($payloadUserId === '' && empty($payloadUserIds) && $authUserId !== '') {
                $payloadUserId = $authUserId;
            }

            $dto = EnqueueNotificationDTO::fromArray([
                'userId' => $payloadUserId,
                'userIds' => $payloadUserIds,
                'suceso' => $validated['suceso'],
                'channels' => $validated['channels'],
                'tone' => $validated['tone'] ?? 'PROFESIONAL',
                'data' => $validated['data'] ?? [],
                'batchKey' => $validated['batchKey'] ?? null,
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

        if ($updated->userId !== null && $updated->userId !== '') {
            event(new AINotificationGenerated($this->toRealtimePayload($updated, 'read')));
        }

        return response()->json([
            'success' => true,
            'data' => (new NotificationResource($updated))->toArray($request),
        ]);
    }

    public function broadcastAuth(Request $request): JsonResponse
    {
        $authUserId = trim((string) $request->get('auth_user_id', ''));

        if ($authUserId === '') {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado',
            ], 401);
        }

        $socketId = trim((string) $request->input('socket_id', ''));
        $channelName = trim((string) $request->input('channel_name', ''));

        if ($socketId === '' || $channelName === '') {
            return response()->json([
                'success' => false,
                'message' => 'Parámetros de broadcast inválidos',
            ], 422);
        }

        if (!str_starts_with($channelName, 'private-user.')) {
            return response()->json([
                'success' => false,
                'message' => 'Canal no permitido',
            ], 403);
        }

        $channelUserId = substr($channelName, strlen('private-user.'));

        if ($channelUserId !== $authUserId) {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado para este canal',
            ], 403);
        }

        $pusherKey = (string) config('broadcasting.connections.pusher.key', '');
        $pusherSecret = (string) config('broadcasting.connections.pusher.secret', '');

        if ($pusherKey === '' || $pusherSecret === '') {
            return response()->json([
                'success' => false,
                'message' => 'Broadcast no configurado',
            ], 500);
        }

        $signature = hash_hmac('sha256', $socketId . ':' . $channelName, $pusherSecret);

        return response()->json([
            'success' => true,
            'auth' => $pusherKey . ':' . $signature,
        ]);
    }

    private function toRealtimePayload(Notification $notification, string $action, array $meta = []): array
    {
        return [
            'action' => $action,
            'id' => $notification->id,
            'user_id' => $notification->userId,
            'userId' => $notification->userId,
            'suceso' => $notification->suceso,
            'status' => $notification->status->value,
            'tone' => $notification->tone,
            'urgencia' => $notification->urgencia,
            'llegit' => $notification->llegit,
            'channels' => $notification->channels,
            'data' => $notification->data,
            'meta' => $meta,
            'createdAt' => $notification->createdAt,
            'updatedAt' => $notification->updatedAt,
            'broadcastedAt' => now()->toIso8601String(),
        ];
    }
}
