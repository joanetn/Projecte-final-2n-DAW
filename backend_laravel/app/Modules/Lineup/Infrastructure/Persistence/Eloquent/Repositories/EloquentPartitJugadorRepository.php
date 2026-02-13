<?php

/**
 * Repositori Eloquent de PartitJugador (Jugadors per Partit).
 *
 * Implementació concreta del repositori usant Eloquent ORM.
 * Gestiona la persistència dels jugadors assignats a cada partit.
 * Totes les consultes filtren per isActive=true (soft delete pattern).
 */

namespace App\Modules\Lineup\Infrastructure\Persistence\Eloquent\Repositories;

use App\Modules\Lineup\Infrastructure\Persistence\Eloquent\Models\PartitJugadorModel;
use App\Modules\Lineup\Infrastructure\Persistence\Mappers\PartitJugadorMapper;
use App\Modules\Lineup\Domain\Entities\PartitJugador;
use App\Modules\Lineup\Domain\Repositories\PartitJugadorRepositoryInterface;

class EloquentPartitJugadorRepository implements PartitJugadorRepositoryInterface
{
    public function __construct(
        private PartitJugadorModel $model,
        private PartitJugadorMapper $mapper
    ) {}

    /**
     * Cerca un registre actiu de jugador-partit pel seu ID.
     */
    public function findById(string $id): ?PartitJugador
    {
        $model = $this->model->where('isActive', true)->find($id);

        return $model ? $this->mapper->toDomain($model) : null;
    }

    /**
     * Cerca un registre actiu amb relacions carregades (eager loading).
     */
    public function findByIdWithRelations(string $id, array $relations): ?PartitJugador
    {
        $model = $this->model
            ->where('isActive', true)
            ->with($relations)
            ->find($id);

        return $model ? $this->mapper->toDomain($model) : null;
    }

    /**
     * Retorna tots els registres actius amb relacions.
     */
    public function findAll(): array
    {
        $models = $this->model
            ->where('isActive', true)
            ->with(['jugador', 'equip', 'partit'])
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    /**
     * Crea un nou registre de jugador-partit.
     */
    public function create(array $data): PartitJugador
    {
        $model = $this->model->create($data);

        return $this->mapper->toDomain($model);
    }

    /**
     * Actualitza un registre existent.
     */
    public function update(string $id, array $data): bool
    {
        return $this->model->where('id', $id)->update($data);
    }

    /**
     * Soft delete: marca el registre com a inactiu.
     */
    public function delete(string $id): bool
    {
        return $this->model->where('id', $id)->update(['isActive' => false]);
    }

    /**
     * Cerca tots els jugadors actius d'un partit concret.
     * Carrega relacions per mostrar detall de cada jugador.
     */
    public function findByPartit(string $partitId): array
    {
        $models = $this->model
            ->where('partitId', $partitId)
            ->where('isActive', true)
            ->with(['jugador', 'equip'])
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    /**
     * Cerca tots els partits on ha participat un jugador concret.
     */
    public function findByJugador(string $jugadorId): array
    {
        $models = $this->model
            ->where('jugadorId', $jugadorId)
            ->where('isActive', true)
            ->with(['partit', 'equip'])
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    /**
     * Cerca els jugadors d'un equip en un partit concret.
     */
    public function findByPartitAndEquip(string $partitId, string $equipId): array
    {
        $models = $this->model
            ->where('partitId', $partitId)
            ->where('equipId', $equipId)
            ->where('isActive', true)
            ->with(['jugador'])
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }
}
