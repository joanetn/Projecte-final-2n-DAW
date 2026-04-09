<?php

namespace App\Modules\User\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'email' => $this->email,
            'telefon' => $this->telefon,
            'dataNaixement' => $this->dataNaixement,
            'nivell' => $this->nivell,
            'avatar' => $this->avatar,
            'dni' => $this->dni,
            'isActive' => $this->isActive,
            'rols' => collect($this->rols ?? [])->map(function ($rol) {
                return [
                    'id' => data_get($rol, 'id'),
                    'usuariId' => data_get($rol, 'usuariId'),
                    'rol' => data_get($rol, 'rol'),
                    'isActive' => data_get($rol, 'isActive'),
                    'createdAt' => data_get($rol, 'createdAt')
                        ?? data_get($rol, 'created_at'),
                ];
            })->toArray(),
            'equipUsuaris' => collect($this->equipUsuaris ?? [])->map(function ($equipUsuari) {
                $equip = data_get($equipUsuari, 'equip');

                return [
                    'id' => data_get($equipUsuari, 'id'),
                    'equipId' => data_get($equipUsuari, 'equipId'),
                    'usuariId' => data_get($equipUsuari, 'usuariId'),
                    'rolEquip' => data_get($equipUsuari, 'rolEquip'),
                    'isActive' => data_get($equipUsuari, 'isActive'),
                    'createdAt' => data_get($equipUsuari, 'createdAt')
                        ?? data_get($equipUsuari, 'created_at'),
                    'equip' => $equip ? [
                        'id' => data_get($equip, 'id'),
                        'nom' => data_get($equip, 'nom'),
                        'categoria' => data_get($equip, 'categoria'),
                        'clubId' => data_get($equip, 'clubId'),
                        'lligaId' => data_get($equip, 'lligaId'),
                        'isActive' => data_get($equip, 'isActive'),
                    ] : null,
                ];
            })->toArray(),
            'compras' => collect($this->compras ?? [])->sortByDesc(function ($compra) {
                return data_get($compra, 'createdAt')
                    ?? data_get($compra, 'created_at')
                    ?? data_get($compra, 'createdat');
            })->values()->map(function ($compra) {
                return [
                    'id' => data_get($compra, 'id'),
                    'usuariId' => data_get($compra, 'usuariId'),
                    'merchId' => data_get($compra, 'merchId'),
                    'quantitat' => data_get($compra, 'quantitat'),
                    'total' => data_get($compra, 'total'),
                    'pagat' => data_get($compra, 'pagat'),
                    'status' => data_get($compra, 'status'),
                    'createdAt' => data_get($compra, 'createdAt')
                        ?? data_get($compra, 'created_at'),
                    'updatedAt' => data_get($compra, 'updatedAt')
                        ?? data_get($compra, 'updated_at'),
                ];
            })->toArray(),
            'seguros' => collect($this->seguros ?? [])->map(function ($seguro) {
                return [
                    'id' => data_get($seguro, 'id'),
                    'usuariId' => data_get($seguro, 'usuariId'),
                    'dataExpiracio' => data_get($seguro, 'dataExpiracio'),
                    'pagat' => data_get($seguro, 'pagat'),
                    'status' => data_get($seguro, 'status'),
                    'createdAt' => data_get($seguro, 'createdAt')
                        ?? data_get($seguro, 'created_at'),
                    'updatedAt' => data_get($seguro, 'updatedAt')
                        ?? data_get($seguro, 'updated_at'),
                ];
            })->toArray(),
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
        ];
    }
}
