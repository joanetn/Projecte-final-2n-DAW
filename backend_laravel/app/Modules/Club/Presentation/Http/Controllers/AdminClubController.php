<?php

namespace App\Modules\Club\Presentation\Http\Controllers;

use App\Modules\Club\Application\Commands\CreateClubCommand;
use App\Modules\Club\Application\Commands\UpdateClubAdminCommand;
use App\Modules\Club\Application\Commands\DestroyClubAdminCommand;
use App\Modules\Club\Application\Commands\CreateEquipCommand;
use App\Modules\Club\Application\Commands\UpdateEquipAdminCommand;
use App\Modules\Club\Application\Commands\DestroyEquipAdminCommand;
use App\Modules\Club\Application\Commands\CreateEquipUsuariCommand;
use App\Modules\Club\Application\Commands\UpdateEquipUsuariCommand;
use App\Modules\Club\Application\Commands\DestroyEquipUsuariCommand;
use App\Modules\Club\Application\DTOs\CreateClubDTO;
use App\Modules\Club\Application\DTOs\UpdateClubDTO;
use App\Modules\Club\Application\DTOs\CreateEquipDTO;
use App\Modules\Club\Application\DTOs\UpdateEquipDTO;
use App\Modules\Club\Application\DTOs\CreateEquipUsuariDTO;
use App\Modules\Club\Application\DTOs\UpdateEquipUsuariDTO;
use App\Modules\Club\Application\Queries\GetClubsAdminQuery;
use App\Modules\Club\Application\Queries\GetClubAdminQuery;
use App\Modules\Club\Application\Queries\GetClubDetailAdminQuery;
use App\Modules\Club\Application\Queries\GetEquipAdminQuery;
use App\Modules\Club\Application\Queries\GetEquipsAdminQuery;
use App\Modules\Club\Application\Queries\GetEquipMembresQuery;
use App\Modules\Club\Domain\Exceptions\ClubNotFoundException;
use App\Modules\Club\Domain\Exceptions\EquipNotFoundException;
use App\Modules\Club\Domain\Exceptions\EquipUsuariNotFoundException;
use App\Modules\Club\Presentation\Http\Requests\CreateClubRequest;
use App\Modules\Club\Presentation\Http\Requests\UpdateClubRequest;
use App\Modules\Club\Presentation\Http\Requests\CreateEquipRequest;
use App\Modules\Club\Presentation\Http\Requests\UpdateEquipRequest;
use App\Modules\Club\Presentation\Http\Requests\CreateEquipUsuariRequest;
use App\Modules\Club\Presentation\Http\Requests\UpdateEquipUsuariRequest;
use App\Modules\Club\Presentation\Http\Resources\ClubResource;
use App\Modules\Club\Presentation\Http\Resources\EquipResource;
use App\Modules\Invitation\Infrastructure\Persistence\Eloquent\Models\InvitacioEquipModel;
use App\Models\Club;
use App\Models\Equip;
use App\Models\EquipUsuari;
use App\Models\Usuari;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class AdminClubController extends Controller
{
    public function __construct(
        private CreateClubCommand $createClubCommand,
        private UpdateClubAdminCommand $updateClubCommand,
        private DestroyClubAdminCommand $destroyClubCommand,
        private CreateEquipCommand $createEquipCommand,
        private UpdateEquipAdminCommand $updateEquipCommand,
        private DestroyEquipAdminCommand $destroyEquipCommand,
        private CreateEquipUsuariCommand $createEquipUsuariCommand,
        private UpdateEquipUsuariCommand $updateEquipUsuariCommand,
        private DestroyEquipUsuariCommand $destroyEquipUsuariCommand,
        private GetClubsAdminQuery $getClubsQuery,
        private GetClubAdminQuery $getClubQuery,
        private GetClubDetailAdminQuery $getClubDetailQuery,
        private GetEquipAdminQuery $getEquipQuery,
        private GetEquipsAdminQuery $getEquipsQuery,
        private GetEquipMembresQuery $getEquipMembresQuery,
    ) {}

    // =====================================================================
    // CLUB ENDPOINTS
    // =====================================================================

    public function index(): JsonResponse
    {
        $clubs = $this->getClubsQuery->execute();

        return response()->json([
            'success' => true,
            'data' => ClubResource::collection($clubs)
        ]);
    }

    public function show(string $id): JsonResponse
    {
        try {
            $club = $this->getClubQuery->execute($id);

            return response()->json([
                'success' => true,
                'data' => new ClubResource($club)
            ]);
        } catch (ClubNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        }
    }

    public function showDetail(string $id): JsonResponse
    {
        try {
            $club = $this->getClubDetailQuery->execute($id);

            return response()->json([
                'success' => true,
                'data' => new ClubResource($club)
            ]);
        } catch (ClubNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        }
    }

    public function store(CreateClubRequest $request): JsonResponse
    {
        try {
            $dto = CreateClubDTO::fromArray($request->validated());
            $clubId = $this->createClubCommand->execute($dto);

            return response()->json([
                'success' => true,
                'message' => 'Club creat correctament',
                'data' => ['id' => $clubId]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function update(UpdateClubRequest $request, string $id): JsonResponse
    {
        try {
            $dto = UpdateClubDTO::fromArray($request->validated());
            $this->updateClubCommand->execute($id, $dto);

            return response()->json([
                'success' => true,
                'message' => 'Club actualitzat correctament'
            ]);
        } catch (ClubNotFoundException $e) {
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

    public function destroy(string $id): JsonResponse
    {
        try {
            $this->destroyClubCommand->execute($id);

            return response()->json([
                'success' => true,
                'message' => 'Club eliminat correctament'
            ]);
        } catch (ClubNotFoundException $e) {
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

    // =====================================================================
    // EQUIP ENDPOINTS
    // =====================================================================

    public function indexEquips(): JsonResponse
    {
        $equips = $this->getEquipsQuery->execute();

        return response()->json([
            'success' => true,
            'data' => EquipResource::collection($equips)
        ]);
    }

    public function showEquip(string $equipId): JsonResponse
    {
        try {
            $equip = $this->getEquipQuery->execute($equipId);

            return response()->json([
                'success' => true,
                'data' => new EquipResource($equip)
            ]);
        } catch (EquipNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        }
    }

    public function updateEquip(string $equipId, UpdateEquipRequest $request): JsonResponse
    {
        try {
            $dto = UpdateEquipDTO::fromArray($request->validated());
            $this->updateEquipCommand->execute($equipId, $dto);

            return response()->json([
                'success' => true,
                'message' => 'Equip actualitzat correctament'
            ]);
        } catch (EquipNotFoundException $e) {
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

    public function destroyEquip(string $equipId): JsonResponse
    {
        try {
            $this->destroyEquipCommand->execute($equipId);

            return response()->json([
                'success' => true,
                'message' => 'Equip eliminat correctament'
            ]);
        } catch (EquipNotFoundException $e) {
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

    // =====================================================================
    // MEMBRES ENDPOINTS
    // =====================================================================

    public function indexMembres(Request $request, string $equipId): JsonResponse
    {
        try {
            [, $authError] = $this->resolveAuthorizedEquip($request, $equipId);
            if ($authError instanceof JsonResponse) {
                return $authError;
            }

            $membres = EquipUsuari::query()
                ->where('equipId', $equipId)
                ->where('isActive', true)
                ->with([
                    'usuari' => function ($query) {
                        $query->where('isActive', true)
                            ->with([
                                'seguros' => fn($seguroQuery) => $seguroQuery->where('isActive', true),
                            ]);
                    },
                ])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function (EquipUsuari $membre) {
                    return [
                        'id' => $membre->id,
                        'equipId' => $membre->equipId,
                        'usuariId' => $membre->usuariId,
                        'rolEquip' => $membre->rolEquip,
                        'isActive' => $membre->isActive,
                        'createdAt' => $membre->created_at?->format('Y-m-d H:i:s'),
                        'updatedAt' => $membre->updated_at?->format('Y-m-d H:i:s'),
                        'nom' => $membre->usuari?->nom,
                        'email' => $membre->usuari?->email,
                        'teSeguir' => $membre->usuari?->seguros?->isNotEmpty(),
                    ];
                })
                ->values();

            return response()->json([
                'success' => true,
                'data' => $membres
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function candidatsInvitacio(Request $request, string $equipId): JsonResponse
    {
        try {
            [, $authError] = $this->resolveAuthorizedEquip($request, $equipId);
            if ($authError instanceof JsonResponse) {
                return $authError;
            }

            $query = trim((string) $request->query('q', ''));
            $limit = (int) $request->query('limit', 30);
            $limit = max(1, min($limit, 100));
            $authUserId = (string) $request->input('auth_user_id', '');

            $membreIds = EquipUsuari::query()
                ->where('equipId', $equipId)
                ->where('isActive', true)
                ->pluck('usuariId');

            $pendingInvitationIds = InvitacioEquipModel::query()
                ->where('equipId', $equipId)
                ->where('isActive', true)
                ->where('estat', 'pendent')
                ->pluck('usuariId');

            $excludedUserIds = $membreIds
                ->merge($pendingInvitationIds)
                ->push($authUserId)
                ->filter()
                ->unique()
                ->values();

            $candidats = Usuari::query()
                ->where('isActive', true)
                ->whereNotIn('id', $excludedUserIds)
                ->whereHas('rols', function ($roleQuery) {
                    $roleQuery
                        ->where('isActive', true)
                        ->whereIn('rol', ['JUGADOR', 'ENTRENADOR']);
                })
                ->with([
                    'rols' => function ($roleQuery) {
                        $roleQuery
                            ->where('isActive', true)
                            ->whereIn('rol', ['JUGADOR', 'ENTRENADOR']);
                    },
                ])
                ->when($query !== '', function ($userQuery) use ($query) {
                    $userQuery->where(function ($searchQuery) use ($query) {
                        $searchQuery
                            ->where('nom', 'like', '%' . $query . '%')
                            ->orWhere('email', 'like', '%' . $query . '%');
                    });
                })
                ->orderBy('nom')
                ->limit($limit)
                ->get()
                ->map(function (Usuari $usuari) {
                    $roles = $usuari->rols
                        ->pluck('rol')
                        ->map(fn($rol) => strtoupper((string) $rol))
                        ->all();

                    return [
                        'id' => $usuari->id,
                        'nom' => $usuari->nom,
                        'email' => $usuari->email,
                        'tipus' => in_array('ENTRENADOR', $roles, true) ? 'ENTRENADOR' : 'JUGADOR',
                    ];
                })
                ->values();

            return response()->json([
                'success' => true,
                'data' => $candidats,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    private function resolveAuthorizedEquip(Request $request, string $equipId): array
    {
        $authUserId = (string) $request->input('auth_user_id', '');

        if ($authUserId === '') {
            return [null, response()->json([
                'success' => false,
                'message' => 'No autenticat',
            ], 401)];
        }

        $rolesFromRequest = $request->input('admin_user_roles', []);
        $roles = collect(is_array($rolesFromRequest) ? $rolesFromRequest : [])
            ->map(fn($role) => strtoupper((string) $role))
            ->filter()
            ->values()
            ->all();

        $equip = Equip::query()
            ->where('id', $equipId)
            ->where('isActive', true)
            ->first(['id', 'clubId']);

        if (!$equip) {
            return [null, response()->json([
                'success' => false,
                'message' => 'Equip no trobat',
            ], 404)];
        }

        $isAdminWeb = in_array('ADMIN_WEB', $roles, true);
        $isAdminClub = in_array('ADMIN_CLUB', $roles, true);
        $isEntrenador = in_array('ENTRENADOR', $roles, true);

        $ownsClub = false;
        if (!empty($equip->clubId)) {
            $ownsClub = Club::query()
                ->where('id', $equip->clubId)
                ->where('isActive', true)
                ->where('creadorId', $authUserId)
                ->exists();
        }

        $isTrainerInEquip = EquipUsuari::query()
            ->where('equipId', $equipId)
            ->where('usuariId', $authUserId)
            ->where('isActive', true)
            ->whereRaw('UPPER("rolEquip") = ?', ['ENTRENADOR'])
            ->exists();

        $canAccess = $isAdminWeb
            || ($isAdminClub && $ownsClub)
            || ($isEntrenador && ($ownsClub || $isTrainerInEquip));

        if (!$canAccess) {
            return [null, response()->json([
                'success' => false,
                'message' => 'No tens permisos per gestionar aquest equip',
            ], 403)];
        }

        return [$equip, null];
    }
}
