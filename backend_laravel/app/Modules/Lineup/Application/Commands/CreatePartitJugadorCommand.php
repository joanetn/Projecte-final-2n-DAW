<?php
namespace App\Modules\Lineup\Application\Commands;
use App\Modules\Lineup\Application\DTOs\CreatePartitJugadorDTO;
use App\Modules\Lineup\Domain\Repositories\PartitJugadorRepositoryInterface;
use Illuminate\Support\Str;
class CreatePartitJugadorCommand
{
    public function __construct(
        private PartitJugadorRepositoryInterface $partitJugadorRepo
    ) {}
    public function execute(CreatePartitJugadorDTO $dto): string
    {
        $partitJugador = $this->partitJugadorRepo->create([
            'id' => Str::uuid()->toString(),
            'partitId' => $dto->partitId,
            'jugadorId' => $dto->jugadorId,
            'equipId' => $dto->equipId,
            'punts' => $dto->punts,
        ]);
        return $partitJugador->id;
    }
}
