<?php

namespace App\Modules\User\Presentation\Http\Controllers;

use App\Models\Club;
use App\Models\Equip;
use App\Models\EquipUsuari;
use App\Models\Usuari;
use App\Modules\User\Application\Commands\CreateUserCommand;
use App\Modules\User\Application\Commands\CreateUserRolCommand;
use App\Modules\User\Application\Commands\DestroyUserCommand;
use App\Modules\User\Application\Commands\DestroyUserRolCommand;
use App\Modules\User\Application\Commands\ToggleUserRolCommand;
use App\Modules\User\Application\Commands\ToggleUserRolsBulkCommand;
use App\Modules\User\Application\Commands\UpdateUserCommand;
use App\Modules\User\Application\Commands\UpdateUserRolCommand;
use App\Modules\User\Application\DTOs\CreateUserDTO;
use App\Modules\User\Application\DTOs\CreateUserRolDTO;
use App\Modules\User\Application\DTOs\CreateUserRolsBulkDTO;
use App\Modules\User\Application\DTOs\UpdateUserDTO;
use App\Modules\User\Application\DTOs\UpdateUserRolDTO;
use App\Modules\User\Application\Queries\GetUserQuery;
use App\Modules\User\Application\Queries\GetUserRolsQuery;
use App\Modules\User\Application\Queries\GetUsersDetailQuery;
use App\Modules\User\Application\Queries\GetUsersQuery;
use App\Modules\User\Domain\Exceptions\InvalidDateBirthException;
use App\Modules\User\Domain\Exceptions\UserNotFoundException;
use App\Modules\User\Presentation\Http\Requests\CreateUserRequest;
use App\Modules\User\Presentation\Http\Requests\CreateUserRolRequest;
use App\Modules\User\Presentation\Http\Requests\CreateUserRolsBulkRequest;
use App\Modules\User\Presentation\Http\Requests\UpdateUserRequest;
use App\Modules\User\Presentation\Http\Requests\UpdateUserRolRequest;
use App\Modules\User\Presentation\Http\Resources\UserDetailResource;
use App\Modules\User\Presentation\Http\Resources\UserResource;
use App\Modules\User\Presentation\Http\Resources\UserRolResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class UserController extends Controller
{
    public function __construct(
        private CreateUserCommand $createUserCommand,
        private UpdateUserCommand $updateUserCommand,
        private DestroyUserCommand $destroyUserCommand,
        private CreateUserRolCommand $createUserRolCommand,
        private ToggleUserRolCommand $toggleUserRolCommand,
        private ToggleUserRolsBulkCommand $toggleUserRolsBulkCommand,
        private UpdateUserRolCommand $updateUserRolCommand,
        private DestroyUserRolCommand $destroyUserRolCommand,
        private GetUserQuery $getUserQuery,
        private GetUsersQuery $getUsersQuery,
        private GetUsersDetailQuery $getUsersDetailQuery,
        private GetUserRolsQuery $getUserRolsQuery,
    ) {}

    public function index(): JsonResponse
    {
        $users = $this->getUsersQuery->execute();

        return response()->json(data: [
            'success' => true,
            'data' => UserResource::collection(resource: $users)
        ]);
    }

    public function show(Request $request, string $usuariId): JsonResponse
    {
        try {
            if ($accessError = $this->ensureSelfOrAdminWeb($request, $usuariId)) {
                return $accessError;
            }

            $user = $this->getUserQuery->execute($usuariId);

            return response()->json([
                'success' => true,
                'data' => new UserResource($user)
            ]);
        } catch (UserNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        }
    }

    public function showDetail(Request $request, string $usuariId): JsonResponse
    {
        try {
            if ($accessError = $this->ensureSelfOrAdminWeb($request, $usuariId)) {
                return $accessError;
            }

            $user = $this->getUsersDetailQuery->execute($usuariId);

            return response()->json([
                'success' => true,
                'data' => new UserDetailResource($user)
            ]);
        } catch (UserNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        }
    }

    public function showMeDetail(Request $request): JsonResponse
    {
        $authUserId = (string) $request->input('auth_user_id', '');

        if ($authUserId === '') {
            return response()->json([
                'success' => false,
                'message' => 'No autenticat'
            ], 401);
        }

        try {
            $user = $this->getUsersDetailQuery->execute($authUserId);

            return response()->json([
                'success' => true,
                'data' => new UserDetailResource($user)
            ]);
        } catch (UserNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        }
    }

    public function showMeEquips(Request $request): JsonResponse
    {
        $authUserId = (string) $request->input('auth_user_id', '');

        if ($authUserId === '') {
            return response()->json([
                'success' => false,
                'message' => 'No autenticat'
            ], 401);
        }

        $membershipRows = EquipUsuari::query()
            ->where('usuariId', $authUserId)
            ->where('isActive', true)
            ->with([
                'equip' => fn($query) => $query
                    ->where('isActive', true)
                    ->with(['lliga:id,nom']),
            ])
            ->get();

        $equipsById = [];

        foreach ($membershipRows as $row) {
            $equip = $row->equip;
            if (!$equip) {
                continue;
            }

            $equipsById[$equip->id] = [
                'id' => $equip->id,
                'nom' => $equip->nom ?: 'Equip sense nom',
                'categoria' => $equip->categoria,
                'clubId' => $equip->clubId,
                'lligaId' => $equip->lligaId,
                'lligaNom' => $equip->lliga?->nom,
                'isActive' => (bool) $equip->isActive,
                'rolMeu' => $row->rolEquip,
            ];
        }

        $managedClubIds = Club::query()
            ->where('creadorId', $authUserId)
            ->where('isActive', true)
            ->pluck('id');

        if ($managedClubIds->isNotEmpty()) {
            $managedEquips = Equip::query()
                ->whereIn('clubId', $managedClubIds)
                ->where('isActive', true)
                ->with(['lliga:id,nom'])
                ->get();

            foreach ($managedEquips as $equip) {
                if (isset($equipsById[$equip->id])) {
                    continue;
                }

                $equipsById[$equip->id] = [
                    'id' => $equip->id,
                    'nom' => $equip->nom ?: 'Equip sense nom',
                    'categoria' => $equip->categoria,
                    'clubId' => $equip->clubId,
                    'lligaId' => $equip->lligaId,
                    'lligaNom' => $equip->lliga?->nom,
                    'isActive' => (bool) $equip->isActive,
                    'rolMeu' => null,
                ];
            }
        }

        return response()->json([
            'success' => true,
            'data' => [
                'equips' => array_values($equipsById),
            ],
        ]);
    }

    public function store(CreateUserRequest $createUserRequest): JsonResponse
    {
        try {
            $dto = CreateUserDTO::fromArray($createUserRequest->validated());
            $userId = $this->createUserCommand->execute($dto);

            return response()->json([
                'success' => true,
                'message' => 'User creat correctament',
                'data' => ['id' => $userId]
            ], 201);
        } catch (InvalidDateBirthException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'exception' => get_class($e),
                'debug' => env('APP_DEBUG')
            ], 400);
        }
    }

    public function update(UpdateUserRequest $updateUserRequest, string $usuariId): JsonResponse
    {
        try {
            $dto = UpdateUserDTO::fromArray($updateUserRequest->validated());
            $this->updateUserCommand->execute($usuariId, $dto);

            return response()->json([
                'success' => true,
                'message' => 'User actualitzat correctamment'
            ]);
        } catch (UserNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        } catch (InvalidDateBirthException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'exception' => get_class($e),
                'debug' => env('APP_DEBUG')
            ], 400);
        }
    }

    public function destroy(string $usuariId)
    {
        try {
            $this->destroyUserCommand->execute($usuariId);

            return response()->json([
                'success' => true,
                'message' => 'User eliminat correctament'
            ]);
        } catch (UserNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'exception' => get_class($e),
                'debug' => env('APP_DEBUG')
            ], 400);
        }
    }

    public function indexRols(string $usuariId): JsonResponse
    {
        try {
            $rols = $this->getUserRolsQuery->execute($usuariId);

            return response()->json([
                'success' => true,
                'data' => UserRolResource::collection($rols)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'exception' => get_class($e),
                'debug' => env('APP_DEBUG')
            ], 400);
        }
    }

    public function storeRol(string $usuariId, CreateUserRolRequest $request): JsonResponse
    {
        try {
            $dto = CreateUserRolDTO::fromArray([
                'usuariId' => $usuariId,
                'rol' => $request->validated()['rol']
            ]);
            $result = $this->toggleUserRolCommand->execute($dto);

            $statusCode = $result['action'] === 'created' ? 201 : 200;
            $message = $result['action'] === 'created'
                ? 'Rol creat correctament'
                : 'Rol actualitzat correctament';

            return response()->json([
                'success' => true,
                'message' => $message,
                'data' => $result
            ], $statusCode);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'exception' => get_class($e),
                'debug' => env('APP_DEBUG')
            ], 400);
        }
    }

    public function updateRol(string $usuariId, string $rolId, UpdateUserRolRequest $request): JsonResponse
    {
        try {
            $dto = UpdateUserRolDTO::fromArray([
                'usuariId' => $usuariId,
                'rolId' => $rolId,
                'isActive' => $request->validated()['isActive']
            ]);
            $this->updateUserRolCommand->execute($dto);

            return response()->json([
                'success' => true,
                'message' => 'Rol actualitzat correctament'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'exception' => get_class($e),
                'debug' => env('APP_DEBUG')
            ], 400);
        }
    }

    public function destroyRol(string $usuariId, string $rolId): JsonResponse
    {
        try {
            $this->destroyUserRolCommand->execute($usuariId, $rolId);

            return response()->json([
                'success' => true,
                'message' => 'Rol eliminat correctament'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'exception' => get_class($e),
                'debug' => env('APP_DEBUG')
            ], 400);
        }
    }

    public function storeRolsBulk(string $usuariId, CreateUserRolsBulkRequest $request): JsonResponse
    {
        try {
            $dto = CreateUserRolsBulkDTO::fromArray([
                'usuariId' => $usuariId,
                'roles' => $request->validated()['roles']
            ]);
            $result = $this->toggleUserRolsBulkCommand->execute($dto);

            return response()->json([
                'success' => true,
                'message' => "Se han procesado {$result['successful']} roles correctamente. Errores: {$result['failed']}",
                'data' => $result
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'exception' => get_class($e),
                'debug' => env('APP_DEBUG')
            ], 400);
        }
    }

    public function getLevels(): JsonResponse
    {
        $levels = \App\Enums\UserLevel::options();

        return response()->json([
            'success' => true,
            'data' => $levels
        ]);
    }

    private function ensureSelfOrAdminWeb(Request $request, string $targetUserId): ?JsonResponse
    {
        $authUserId = (string) $request->input('auth_user_id', '');

        if ($authUserId === '') {
            return response()->json([
                'success' => false,
                'message' => 'No autenticat'
            ], 401);
        }

        if ($authUserId === $targetUserId) {
            return null;
        }

        $authUser = Usuari::with([
            'rols' => fn($query) => $query->where('isActive', true),
        ])->find($authUserId);

        if (!$authUser || !$authUser->isActive) {
            return response()->json([
                'success' => false,
                'message' => 'Usuari no trobat o inactiu'
            ], 403);
        }

        $isAdminWeb = $authUser->rols
            ->pluck('rol')
            ->map(fn($rol) => strtoupper((string) $rol))
            ->contains('ADMIN_WEB');

        if (!$isAdminWeb) {
            return response()->json([
                'success' => false,
                'message' => 'No tens permisos per consultar aquest usuari'
            ], 403);
        }

        return null;
    }
}
