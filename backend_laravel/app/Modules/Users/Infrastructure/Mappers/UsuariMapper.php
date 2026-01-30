<?php

namespace App\Modules\Users\Infrastructure\Mappers;

use App\Modules\Users\Domain\Entities\Usuari;
use App\Modules\Users\Domain\DTOs\UsuariDTO;

class UsuariMapper
{
    public function toDomain(Usuari $usuari): UsuariDTO
    {
        $rols = $usuari->rols->map(function ($rol) {
            return [
                'id' => $rol->id,
                'rol' => $rol->rol,
                'isActive' => $rol->isActive,
            ];
        })->toArray();

        return new UsuariDTO(
            id: $usuari->id,
            nom: $usuari->nom,
            email: $usuari->email,
            telefon: $usuari->telefon,
            dataNaixement: $usuari->dataNaixement,
            nivell: $usuari->nivell,
            avatar: $usuari->avatar,
            dni: $usuari->dni,
            isActive: $usuari->isActive,
            created_at: $usuari->created_at,
            updated_at: $usuari->updated_at,
            rols: $rols,
        );
    }

    public function toPersistence(UsuariDTO $dto): array
    {
        return [
            'id' => $dto->id,
            'nom' => $dto->nom,
            'email' => $dto->email,
            'telefon' => $dto->telefon,
            'dataNaixement' => $dto->dataNaixement,
            'nivell' => $dto->nivell,
            'avatar' => $dto->avatar,
            'dni' => $dto->dni,
            'isActive' => $dto->isActive,
        ];
    }
}
