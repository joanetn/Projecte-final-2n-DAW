<?php

namespace App\Modules\Notifications\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    /**
     * @param Request $request
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'userId' => $this->userId,
            'suceso' => $this->suceso,
            'status' => $this->status->value ?? (string) $this->status,
            'tone' => $this->tone,
            'urgencia' => $this->urgencia,
            'llegit' => $this->llegit,
            'channels' => $this->channels,
            'data' => $this->data,
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
        ];
    }
}
