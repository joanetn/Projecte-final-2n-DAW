<?php

namespace App\Modules\League\Infrastructure\Peristence\Eloquent\Repositories;

use App\Modules\League\Domain\Entities\League;
use App\Modules\League\Domain\Repositories\LeagueRepositoryInterface;
use App\Modules\League\Infrastructure\Peristence\Eloquent\Models\LeagueModel;
use App\Modules\League\Infrastructure\Peristence\Mappers\LeagueMapper;

class EloquentLeagueRepository implements LeagueRepositoryInterface
{
    public function __construct(
        private LeagueModel $leagueModel,
        private LeagueMapper $leagueMapper
    ) {}

    public function findById(string $id): ?League
    {
        $model = $this->leagueModel->where('isActive', true)->find($id);

        return $model ? $this->leagueMapper->toDomain($model) : null;
    }

    public function findByIdWithRelations(string $id, array $relations): ?League
    {
        $model = $this->leagueModel
            ->where('isActive', true)
            ->with($relations)
            ->find($id);

        return $model ? $this->leagueMapper->toDomain($model) : null;
    }

    public function findAll(): array
    {
        $models = $this->leagueModel
            ->where('isActive', true)
            ->with(['equips', 'jornades', 'classificacions'])
            ->orderBy('dataInici', 'desc')
            ->get();

        return $models->map([$this->leagueMapper, 'toDomain'])->toArray();
    }

    public function create(array $data): League
    {
        $model = $this->leagueModel->create($data);

        return $this->leagueMapper->toDomain($model);
    }

    public function update(string $id, array $data): bool
    {
        return $this->leagueModel->where('id', $id)->update($data);
    }

    public function delete(string $id): bool
    {
        return $this->leagueModel->where('id', $id)->update(['isActive' => false]);
    }

    public function findByCategoria(string $categoria): array
    {
        $models = $this->leagueModel
            ->where('categoria', $categoria)
            ->where('isActive', true)
            ->with(['equips', 'jornades', 'classificacions'])
            ->get();

        return $models->map([$this->leagueMapper, 'toDomain'])->toArray();
    }
}
