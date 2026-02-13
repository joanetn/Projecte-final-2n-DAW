<?php

/**
 * Repositori Eloquent d'Alineacions.
 *
 * Implementació concreta del repositori d'alineacions usant Eloquent ORM.
 * Implementa la interfície AlineacioRepositoryInterface del domini.
 * Totes les consultes filtren per isActive=true (soft delete pattern).
 */

namespace App\Modules\Lineup\Infrastructure\Persistence\Eloquent\Repositories;

use App\Modules\Lineup\Infrastructure\Persistence\Eloquent\Models\AlineacioModel;
use App\Modules\Lineup\Infrastructure\Persistence\Mappers\AlineacioMapper;
use App\Modules\Lineup\Domain\Entities\Alineacio;
use App\Modules\Lineup\Domain\Repositories\AlineacioRepositoryInterface;

class EloquentAlineacioRepository implements AlineacioRepositoryInterface
{
    public function __construct(
        private AlineacioModel $model,
        private AlineacioMapper $mapper
    ) {}

    /**
     * Cerca una alineació activa pel seu ID.
     */
    public function findById(string $id): ?Alineacio
    {
        $model = $this->model->where('isActive', true)->find($id);

        return $model ? $this->mapper->toDomain($model) : null;
    }

    /**
     * Cerca una alineació activa pel seu ID amb relacions carregades.
     * Utilitza eager loading per evitar el problema N+1.
     */
    public function findByIdWithRelations(string $id, array $relations): ?Alineacio
    {
        $model = $this->model
            ->where('isActive', true)
            ->with($relations)
            ->find($id);

        return $model ? $this->mapper->toDomain($model) : null;
    }

    /**
     * Retorna totes les alineacions actives ordenades per data de creació.
     */
    public function findAll(): array
    {
        $models = $this->model
            ->where('isActive', true)
            ->with(['jugador', 'equip', 'partit'])
            ->orderBy('creada_at', 'desc')
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    /**
     * Crea una nova alineació a la base de dades.
     */
    public function create(array $data): Alineacio
    {
        $model = $this->model->create($data);

        return $this->mapper->toDomain($model);
    }

    /**
     * Actualitza una alineació existent.
     */
    public function update(string $id, array $data): bool
    {
        return $this->model->where('id', $id)->update($data);
    }

    /**
     * Soft delete: marca l'alineació com a inactiva (isActive = false).
     */
    public function delete(string $id): bool
    {
        return $this->model->where('id', $id)->update(['isActive' => false]);
    }

    /**
     * Cerca totes les alineacions actives d'un partit concret.
     * Carrega les relacions jugador i equip per mostrar detall.
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
     * Cerca totes les alineacions actives d'un equip concret.
     */
    public function findByEquip(string $equipId): array
    {
        $models = $this->model
            ->where('equipId', $equipId)
            ->where('isActive', true)
            ->with(['jugador', 'partit'])
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    /**
     * Cerca totes les alineacions actives d'un jugador concret.
     */
    public function findByJugador(string $jugadorId): array
    {
        $models = $this->model
            ->where('jugadorId', $jugadorId)
            ->where('isActive', true)
            ->with(['equip', 'partit'])
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    /**
     * Cerca les alineacions d'un equip en un partit concret.
     * Útil per validar duplicats i mostrar la formació d'un equip en un partit.
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
