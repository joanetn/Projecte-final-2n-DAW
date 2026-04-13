<?php

namespace App\Modules\Notifications\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EnqueueNotificationResource extends JsonResource
{
    /**
     * @param Request $request
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'suceso' => $this->suceso,
            'status' => $this->status->value,
            'urgencia' => $this->urgencia,
            'tone' => $this->tone,
            'channels' => $this->channels,
        ];
    }
}
