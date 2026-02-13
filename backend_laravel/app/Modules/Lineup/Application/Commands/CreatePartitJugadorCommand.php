<?php

/**
 * Command per crear un nou PartitJugador (jugador assignat a un partit).
 *
 * Executa la lògica de creació:
 * 1. Crea el registre al repositori amb un UUID únic
 * 2. Retorna l'ID del nou registre creat
 */

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
        // Creem el registre de jugador-partit amb UUID únic
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
