<?php
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
    public function findById(string $id): ?Puntuacio
    {
        $model = $this->model->where('isActive', true)->find($id);
        return $model ? $this->mapper->toDomain($model) : null;
    }
    public function findByIdWithRelations(string $id, array $relations): ?Puntuacio
    {
        $model = $this->model
            ->where('isActive', true)
            ->with($relations)
            ->find($id);
        return $model ? $this->mapper->toDomain($model) : null;
    }
    public function findAll(): array
    {
        $models = $this->model
            ->where('isActive', true)
            ->with(['jugador', 'partit'])
            ->get();
        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }
    public function create(array $data): Puntuacio
    {
        $model = $this->model->create($data);
        return $this->mapper->toDomain($model);
    }
    public function update(string $id, array $data): bool
    {
        return $this->model->where('id', $id)->update($data);
    }
    public function delete(string $id): bool
    {
        return $this->model->where('id', $id)->update(['isActive' => false]);
    }
    public function findByPartit(string $partitId): array
    {
        $models = $this->model
            ->where('partitId', $partitId)
            ->where('isActive', true)
            ->with(['jugador'])
            ->get();
        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }
    public function findByJugador(string $jugadorId): array
    {
        $models = $this->model
            ->where('jugadorId', $jugadorId)
            ->where('isActive', true)
            ->with(['partit'])
            ->get();
        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }
    public function getRanking(): array
    {
        $models = $this->model
            ->join('usuaris', 'puntuacions.jugadorId', '=', 'usuaris.id')
            ->where('puntuacions.isActive', true)
            ->where('usuaris.isActive', true)
            ->select(
                'puntuacions.jugadorId',
                'usuaris.nom as jugadorNom'
            )
            ->groupBy('puntuacions.jugadorId', 'usuaris.nom')
            ->orderByDesc('totalPunts')
            ->get();
        return $models->map([$this->mapper, 'toDomain'])->toArray();
    }
}
