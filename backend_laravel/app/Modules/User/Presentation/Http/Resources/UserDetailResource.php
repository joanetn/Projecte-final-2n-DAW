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
                    'id' => $rol['id'] ?? $rol->id,
                    'rol' => $rol['rol'] ?? $rol->rol,
                    'isActive' => $rol['isActive'] ?? $rol->isActive,
                ];
            })->toArray(),
            'equipUsuaris' => collect($this->equipUsuaris ?? [])->map(function ($equipUsuari) {
                return [
                    'id' => $equipUsuari['id'] ?? $equipUsuari->id,
                    'equipId' => $equipUsuari['equipId'] ?? $equipUsuari->equipId,
                    'rolEquip' => $equipUsuari['rolEquip'] ?? $equipUsuari->rolEquip,
                    'isActive' => $equipUsuari['isActive'] ?? $equipUsuari->isActive,
                ];
            })->toArray(),
            'compras' => collect($this->compras ?? [])->map(function ($compra) {
                return [
                    'id' => $compra['id'] ?? $compra->id,
                    'merchId' => $compra['merchId'] ?? $compra->merchId,
                    'quantitat' => $compra['quantitat'] ?? $compra->quantitat,
                    'total' => $compra['total'] ?? $compra->total,
                    'pagat' => $compra['pagat'] ?? $compra->pagat,
                    'status' => $compra['status'] ?? $compra->status,
                ];
            })->toArray(),
            'seguros' => collect($this->seguros ?? [])->map(function ($seguro) {
                return [
                    'id' => $seguro['id'] ?? $seguro->id,
                    'dataExpiracio' => $seguro['dataExpiracio'] ?? $seguro->dataExpiracio,
                    'pagat' => $seguro['pagat'] ?? $seguro->pagat,
                ];
            })->toArray(),
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
        ];
    }
}
