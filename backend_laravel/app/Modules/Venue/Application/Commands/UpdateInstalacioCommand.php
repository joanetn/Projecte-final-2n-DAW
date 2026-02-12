<?php

/**
 * Command per actualitzar una Instal·lació existent.
 *
 * Segueix el patró CQRS (Command): operació d'escriptura.
 * Només valida i actualitza els camps que s'han enviat (no null).
 * Comprova que la instal·lació existeixi abans d'actualitzar.
 */

namespace App\Modules\Venue\Application\Commands;

use App\Modules\Venue\Application\DTOs\UpdateInstalacioDTO;
use App\Modules\Venue\Domain\Exceptions\InstalacioNotFoundException;
use App\Modules\Venue\Domain\Repositories\InstalacioRepositoryInterface;
use App\Modules\Venue\Domain\Services\VenueDomainService;

class UpdateInstalacioCommand
{
    public function __construct(
        private InstalacioRepositoryInterface $instalacioRepository,
        private VenueDomainService $venueDomainService
    ) {}

    public function execute(string $instalacioId, UpdateInstalacioDTO $dto): void
    {
        // Comprovar que la instal·lació existeix
        $instalacio = $this->instalacioRepository->findById($instalacioId);
        if (!$instalacio) {
            throw new InstalacioNotFoundException();
        }

        // Validar cada camp només si ha estat enviat al request
        if ($dto->nom !== null) {
            $this->venueDomainService->validateInstalacioName($dto->nom);
        }

        if ($dto->telefon !== null) {
            $this->venueDomainService->validatePhone($dto->telefon);
        }

        if ($dto->numPistes !== null) {
            $this->venueDomainService->validateNumPistes($dto->numPistes);
        }

        // Filtrar només els camps no nuls per fer l'update parcial
        $updateData = array_filter([
            'nom' => $dto->nom,
            'adreca' => $dto->adreca,
            'telefon' => $dto->telefon,
            'tipusPista' => $dto->tipusPista,
            'numPistes' => $dto->numPistes,
            'clubId' => $dto->clubId,
            'isActive' => $dto->isActive,
        ], fn($value) => $value !== null);

        // Actualitzar la instal·lació a la base de dades
        $this->instalacioRepository->update($instalacioId, $updateData);
    }
}
