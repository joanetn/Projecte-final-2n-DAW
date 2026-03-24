<?php

namespace App\Modules\AdminWeb\Presentation\Http\Resources;

use App\Modules\AdminWeb\Domain\Entities\LeagueSchedule;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LeagueScheduleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        if ($this->resource instanceof LeagueSchedule) {
            return $this->resource->toArray();
        }

        return (array) $this->resource;
    }
}
