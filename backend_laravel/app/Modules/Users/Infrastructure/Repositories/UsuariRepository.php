<?php

namespace App\Modules\Users\Infrastructure\Repositories;

use App\Modules\Users\Domain\Entities\Usuari;
use App\Modules\Users\Domain\DTOs\UsuariDTO;
use App\Modules\Users\Infrastructure\Mappers\UsuariMapper;
use Illuminate\Support\Collection;

class UsuariRepository
{
    public function __construct(
        private Usuari $model,
        private UsuariMapper $mapper,
    ) {
    }

    public function getAll(int $perPage = 15): object
    {
        return $this->model
            ->with('rols')
            ->paginate($perPage);
    }

    public function getById(string $id): ?UsuariDTO
    {
        $usuari = $this->model->with('rols')->find($id);

        if (!$usuari) {
            return null;
        }

        return $this->mapper->toDomain($usuari);
    }

    public function getByEmail(string $email): ?UsuariDTO
    {
        $usuari = $this->model->with('rols')->where('email', $email)->first();

        if (!$usuari) {
            return null;
        }

        return $this->mapper->toDomain($usuari);
    }

    public function create(array $data): UsuariDTO
    {
        $usuari = $this->model->create($data);
        $usuari->load('rols');

        return $this->mapper->toDomain($usuari);
    }

    public function update(string $id, array $data): ?UsuariDTO
    {
        $usuari = $this->model->find($id);

        if (!$usuari instanceof Usuari) {
            return null;
        }

        $usuari->update($data);
        $usuari->load('rols');

        return $this->mapper->toDomain($usuari);
    }

    public function delete(string $id): bool
    {
        $usuari = $this->model->find($id);

        if (!$usuari instanceof Usuari) {
            return false;
        }

        return $usuari->delete();
    }

    public function exists(string $email): bool
    {
        return $this->model->where('email', $email)->exists();
    }

    public function getActive(): Collection
    {
        return $this->model->where('isActive', true)->get();
    }
}
