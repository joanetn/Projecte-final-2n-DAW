<?php

namespace App\Modules\Auth\Application\Commands;

use App\Enums\UserLevel;
use App\Modules\Auth\Domain\Entities\RefreshSession;
use App\Modules\Auth\Infrastructure\Persistence\Eloquent\Repositories\EloquentAuthRepository;
use App\Modules\User\Application\Commands\CreateUserCommand;
use App\Modules\User\Application\DTOs\CreateUserDTO;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Facades\JWTFactory;

class RegisterCommand
{
    public function __construct(
        private CreateUserCommand $createUserCommand,
        private EloquentAuthRepository $authRepo,
    ) {}

    public function execute(
        string $nom,
        string $email,
        string $contrasenya,
        string $deviceId,
        ?string $telefon = null,
        ?string $dataNaixement = null,
        ?string $avatar = null,
        ?string $dni = null,
        ?string $deviceType = null,
        ?string $browser = null,
        ?string $os = null,
    ): array {

        $avatarDEFAULT = $avatar ?? 'https://ui-avatars.com/api/?name=' . urlencode($nom) . '&background=random&size=128';
        $dto = new CreateUserDTO(
            nom: $nom,
            email: $email,
            contrasenya: $contrasenya,
            telefon: $telefon,
            dataNaixement: $dataNaixement,
            avatar: $avatarDEFAULT,
            dni: $dni,
            nivell: UserLevel::PRINCIPANT->value,
        );

        $userId = $this->createUserCommand->execute($dto);

        $user = $this->authRepo->findUserById($userId);

        $sessionVersion = $this->authRepo->getUserSessionVersion($userId);

        $familyId = Str::uuid()->toString();

        $accessPayload = JWTFactory::sub($userId)->make();
        $accessToken   = JWTAuth::encode($accessPayload)->get();

        $refreshPayload = JWTFactory::sub($userId)
            ->claims([
                'familyId' => $familyId,
                'type'     => 'refresh',
            ])
            ->setTTL(60 * 24 * 7)
            ->make();
        $refreshToken = JWTAuth::encode($refreshPayload)->get();

        $tokenHash = hash('sha256', $refreshToken);

        $session = new RefreshSession(
            id: Str::uuid()->toString(),
            user_id: $userId,
            device_id: $deviceId,
            device_type: $deviceType,
            browser: $browser,
            os: $os,
            family_id: $familyId,
            current_token_hash: $tokenHash,
            revoked: false,
            session_version: $sessionVersion,
            last_used_at: now()->format('Y-m-d H:i:s'),
            createdAt: now()->format('Y-m-d H:i:s'),
            updatedAt: now()->format('Y-m-d H:i:s'),
        );

        $this->authRepo->createRefreshSession($session);

        return [
            'access_token'  => $accessToken,
            'refresh_token' => $refreshToken,
            'token_type'    => 'Bearer',
            'expires_in'    => config('jwt.ttl', 15) * 60,
            'user'          => $user,
        ];
    }
}
