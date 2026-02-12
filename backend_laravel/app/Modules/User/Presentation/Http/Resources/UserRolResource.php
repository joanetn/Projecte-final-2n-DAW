<?php

namespace App\Modules\User\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserRolResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'usuariId' => $this->usuariId,
            'rol' => $this->rol,
            'isActive' => $this->isActive,
            'createdAt' => $this->createdAt,
        ];
    }
}
