<?php
namespace App\Modules\Lineup\Domain\Events;
use App\Modules\Lineup\Domain\Entities\Alineacio;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
class AlineacioCreatedEvent
{
    use Dispatchable, SerializesModels;
    public function __construct(
        public readonly Alineacio $alineacio
    ) {}
}
