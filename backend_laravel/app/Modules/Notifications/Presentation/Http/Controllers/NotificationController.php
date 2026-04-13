<?php

namespace App\Modules\Notifications\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Notifications\Application\Commands\EnqueueNotificationCommand;
use App\Modules\Notifications\Application\DTOs\EnqueueNotificationDTO;
use App\Modules\Notifications\Presentation\Http\Requests\EnqueueNotificationRequest;
use App\Modules\Notifications\Presentation\Http\Resources\EnqueueNotificationResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class NotificationController extends Controller
{
    public function __construct(
        private EnqueueNotificationCommand $enqueueNotificationCommand
    ) {}

    public function enqueue(EnqueueNotificationRequest $request): JsonResponse
    {
        try {
            $dto = EnqueueNotificationDTO::fromArray([
                'userId' => $request->validated('userId') ?? '',
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
}
