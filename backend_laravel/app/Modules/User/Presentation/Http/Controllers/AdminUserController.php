<?php

namespace App\Modules\User\Presentation\Http\Controllers;

use App\Modules\User\Application\Commands\CreateUserCommand;
use App\Modules\User\Application\Commands\DestroyUserAdminCommand;
use App\Modules\User\Application\Commands\DestroyUserRolCommand;
use App\Modules\User\Application\Commands\ToggleUserRolCommand;
use App\Modules\User\Application\Commands\ToggleUserRolsBulkCommand;
use App\Modules\User\Application\Commands\UpdateUserAdminCommand;
use App\Modules\User\Application\Commands\UpdateUserRolCommand;
use App\Modules\User\Application\DTOs\CreateUserDTO;
use App\Modules\User\Application\DTOs\CreateUserRolDTO;
use App\Modules\User\Application\DTOs\CreateUserRolsBulkDTO;
use App\Modules\User\Application\DTOs\UpdateUserDTO;
use App\Modules\User\Application\DTOs\UpdateUserRolDTO;
use App\Modules\User\Application\Queries\GetUserAdminQuery;
use App\Modules\User\Application\Queries\GetUserDetailAdminQuery;
use App\Modules\User\Application\Queries\GetUserRolsQuery;
use App\Modules\User\Application\Queries\SearchUsersAdminQuery;
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

class AdminUserController extends Controller
{
    public function __construct(
        private CreateUserCommand $createUserCommand,
        private UpdateUserAdminCommand $updateUserCommand,
        private DestroyUserAdminCommand $destroyUserCommand,
        private ToggleUserRolCommand $toggleUserRolCommand,
        private ToggleUserRolsBulkCommand $toggleUserRolsBulkCommand,
        private UpdateUserRolCommand $updateUserRolCommand,
        private DestroyUserRolCommand $destroyUserRolCommand,
        private GetUserAdminQuery $getUserAdminQuery,
        private GetUserDetailAdminQuery $getUserDetailAdminQuery,
        private GetUserRolsQuery $getUserRolsQuery,
        private SearchUsersAdminQuery $searchUsersAdminQuery,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $q      = $request->query('q');
        $nivell = $request->query('nivell');
        $sort   = $request->query('sort', 'created_at_desc');
        $page   = (int) $request->query('page', 1);
        $limit  = (int) $request->query('limit', 20);

        $result = $this->searchUsersAdminQuery->execute(
            q: $q,
            nivell: $nivell,
            sort: $sort,
            page: $page,
            limit: $limit
        );

        return response()->json([
            'success'      => true,
            'data'         => UserResource::collection($result['data']),
            'current_page' => $result['current_page'],
            'per_page'     => $result['per_page'],
            'last_page'    => $result['last_page'],
            'total'        => $result['total'],
        ]);
    }

    public function show(string $usuariId): JsonResponse
    {
        try {
            $user = $this->getUserAdminQuery->execute($usuariId);

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

    public function showDetail(string $usuariId): JsonResponse
    {
        try {
            $user = $this->getUserDetailAdminQuery->execute($usuariId);

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
                'message' => $e->getMessage()
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
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function destroy(string $usuariId): JsonResponse
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
                'message' => $e->getMessage()
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
                'message' => $e->getMessage()
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
                'message' => $e->getMessage()
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
                'message' => $e->getMessage()
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
                'message' => $e->getMessage()
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
                'message' => $e->getMessage()
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
}
