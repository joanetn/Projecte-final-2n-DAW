<?php

namespace App\Modules\Users\Application\Services;

use App\Modules\Users\Domain\DTOs\UsuariDTO;
use App\Modules\Users\Domain\DTOs\CreateUsuariDTO;
use App\Modules\Users\Infrastructure\Repositories\UsuariRepository;
use Illuminate\Support\Facades\Hash;
use Exception;

class UsuariService
{
    public function __construct(
        private UsuariRepository $usuariRepository,
    ) {
    }

    public function getAllUsuaris(int $perPage = 15): object
    {
        return $this->usuariRepository->getAll($perPage);
    }

    public function getUsuariById(string $id): ?UsuariDTO
    {
        return $this->usuariRepository->getById($id);
    }

    public function getUsuariByEmail(string $email): ?UsuariDTO
    {
        return $this->usuariRepository->getByEmail($email);
    }

    public function createUsuari(CreateUsuariDTO $dto): UsuariDTO
    {
        // Validar que no existe
        if ($this->usuariRepository->exists($dto->email)) {
            throw new Exception("El email {$dto->email} ya está registrado");
        }

        // Crear usuari con contrasenya hasheada
        $data = [
            'id' => $this->generateCUID(),
            'nom' => $dto->nom,
            'email' => $dto->email,
            'contrasenya' => Hash::make($dto->contrasenya),
            'telefon' => $dto->telefon,
            'dataNaixement' => $dto->dataNaixement,
            'nivell' => $dto->nivell,
            'avatar' => $dto->avatar,
            'dni' => $dto->dni,
            'isActive' => true,
        ];

        return $this->usuariRepository->create($data);
    }

    public function updateUsuari(string $id, array $data): ?UsuariDTO
    {
        $usuari = $this->getUsuariById($id);

        if (!$usuari) {
            throw new Exception("Usuari no encontrado");
        }

        // No permitir actualizar contrasenya por aquí
        unset($data['contrasenya']);
        unset($data['id']);

        return $this->usuariRepository->update($id, $data);
    }

    public function deleteUsuari(string $id): bool
    {
        $usuari = $this->getUsuariById($id);

        if (!$usuari) {
            throw new Exception("Usuari no encontrado");
        }

        return $this->usuariRepository->delete($id);
    }

    public function changePassword(string $id, string $newPassword): bool
    {
        return (bool) $this->usuariRepository->update($id, [
            'contrasenya' => Hash::make($newPassword),
        ]);
    }

    public function deactivateUsuari(string $id): ?UsuariDTO
    {
        return $this->usuariRepository->update($id, ['isActive' => false]);
    }

    public function activateUsuari(string $id): ?UsuariDTO
    {
        return $this->usuariRepository->update($id, ['isActive' => true]);
    }

    private function generateCUID(): string
    {
        // Generar CUID simple (en producción usa librería)
        return 'c' . uniqid() . str_pad(mt_rand(0, 999), 3, '0', STR_PAD_LEFT);
    }
}
