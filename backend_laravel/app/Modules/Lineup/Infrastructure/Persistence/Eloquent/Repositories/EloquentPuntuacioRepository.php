<?php

/**
 * Repositori Eloquent de Puntuacions (Scoring).
 *
 * Implementació concreta del repositori usant Eloquent ORM.
 * Gestiona les puntuacions dels jugadors en els partits.
 * Inclou funcionalitat de rànquing per punts acumulats.
 * Totes les consultes filtren per isActive=true (soft delete pattern).
 */

namespace App\Modules\Lineup\Infrastructure\Persistence\Eloquent\Repositories;

use App\Modules\Lineup\Infrastructure\Persistence\Eloquent\Models\PuntuacioModel;
use App\Modules\Lineup\Infrastructure\Persistence\Mappers\PuntuacioMapper;
use App\Modules\Lineup\Domain\Entities\Puntuacio;
use App\Modules\Lineup\Domain\Repositories\PuntuacioRepositoryInterface;
use Illuminate\Support\Facades\DB;

class EloquentPuntuacioRepository implements PuntuacioRepositoryInterface
{
    public function __construct(
        private PuntuacioModel $model,
        private PuntuacioMapper $mapper
    ) {}

    /**
     * Cerca una puntuació activa pel seu ID.
     */
    public function findById(string $id): ?Puntuacio
    {
        $model = $this->model->where('isActive', true)->find($id);

        return $model ? $this->mapper->toDomain($model) : null;
    }

    /**
     * Cerca una puntuació activa amb relacions carregades (eager loading).
     */
    public function findByIdWithRelations(string $id, array $relations): ?Puntuacio
    {
        $model = $this->model
            ->where('isActive', true)
            ->with($relations)
            ->find($id);

        return $model ? $this->mapper->toDomain($model) : null;
    }

    /**
     * Retorna totes les puntuacions actives amb relacions.
     */
    public function findAll(): array
    {
        $models = $this->model
            ->where('isActive', true)
            ->with(['jugador', 'partit'])
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    /**
     * Crea una nova puntuació.
     */
    public function create(array $data): Puntuacio
    {
        $model = $this->model->create($data);

        return $this->mapper->toDomain($model);
    }

    /**
     * Actualitza una puntuació existent.
     */
    public function update(string $id, array $data): bool
    {
        return $this->model->where('id', $id)->update($data);
    }

    /**
     * Soft delete: marca la puntuació com a inactiva.
     */
    public function delete(string $id): bool
    {
        return $this->model->where('id', $id)->update(['isActive' => false]);
    }

    /**
     * Cerca totes les puntuacions actives d'un partit concret.
     * Carrega la relació jugador per mostrar detall.
     */
    public function findByPartit(string $partitId): array
    {
        $models = $this->model
            ->where('partitId', $partitId)
            ->where('isActive', true)
            ->with(['jugador'])
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    /**
     * Cerca totes les puntuacions actives d'un jugador concret.
     * Carrega la relació partit per mostrar context.
     */
    public function findByJugador(string $jugadorId): array
    {
        $models = $this->model
            ->where('jugadorId', $jugadorId)
            ->where('isActive', true)
            ->with(['partit'])
            ->get();

        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }

    /**
     * Retorna el rànquing de jugadors per punts totals acumulats.
     * Agrupa per jugador, suma els punts i ordena descendentment.
     * Retorna: jugadorId, nom del jugador, i total de punts.
     */
    public function getRanking(): array
    {
        return DB::table('puntuacions')
            ->join('usuaris', 'puntuacions.jugadorId', '=', 'usuaris.id')
            ->where('puntuacions.isActive', true)
            ->where('usuaris.isActive', true)
            ->select(
                'puntuacions.jugadorId',
                'usuaris.nom as jugadorNom',
                DB::raw('SUM(puntuacions.punts) as totalPunts'),
                DB::raw('COUNT(puntuacions.id) as totalPartits')
            )
            ->groupBy('puntuacions.jugadorId', 'usuaris.nom')
            ->orderByDesc('totalPunts')
            ->get()
            ->toArray();
    }
}
