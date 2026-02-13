<?php
namespace App\Modules\Lineup\Application\Commands;
use App\Modules\Lineup\Domain\Repositories\AlineacioRepositoryInterface;
use App\Modules\Lineup\Domain\Exceptions\AlineacioNotFoundException;
use App\Modules\Lineup\Domain\Events\AlineacioDeletedEvent;
use Illuminate\Support\Facades\Event;
class DestroyAlineacioCommand
{
    public function __construct(
        private AlineacioRepositoryInterface $alineacioRepo
    ) {}
    public function execute(string $alineacioId): void
    {
        $alineacio = $this->alineacioRepo->findById($alineacioId);
        if (!$alineacio) {
            throw new AlineacioNotFoundException($alineacioId);
        }
        $this->alineacioRepo->delete($alineacioId);
        Event::dispatch(new AlineacioDeletedEvent($alineacio));
    }
}
