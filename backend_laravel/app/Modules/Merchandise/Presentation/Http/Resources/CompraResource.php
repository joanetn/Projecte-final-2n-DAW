<?php

namespace App\Modules\Merchandise\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompraResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'usuariId' => $this->usuariId,
            'merchId' => $this->merchId,
            'quantitat' => $this->quantitat,
            'total' => $this->total,
            'pagat' => $this->pagat,
            'status' => $this->status,
            'isActive' => $this->isActive,
            'createdAt' => $this->createdAt,
            'usuari' => $this->usuari,
            'merch' => $this->merch,
        ];
    }
}
