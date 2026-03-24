<?php

namespace App\Modules\Club\Presentation\Http\Controllers;

// --- Commands: classes que executen accions d'escriptura (crear, actualitzar, eliminar) ---
use App\Modules\Club\Application\Commands\CreateClubCommand;
use App\Modules\Club\Application\Commands\UpdateClubCommand;
use App\Modules\Club\Application\Commands\DestroyClubCommand;
use App\Modules\Club\Application\Commands\CreateEquipCommand;
use App\Modules\Club\Application\Commands\UpdateEquipCommand;
use App\Modules\Club\Application\Commands\DestroyEquipCommand;
use App\Modules\Club\Application\Commands\CreateEquipUsuariCommand;
use App\Modules\Club\Application\Commands\UpdateEquipUsuariCommand;
use App\Modules\Club\Application\Commands\DestroyEquipUsuariCommand;

// --- DTOs: objectes que transporten les dades entre capes ---
use App\Modules\Club\Application\DTOs\CreateClubDTO;
use App\Modules\Club\Application\DTOs\UpdateClubDTO;
use App\Modules\Club\Application\DTOs\CreateEquipDTO;
use App\Modules\Club\Application\DTOs\UpdateEquipDTO;
use App\Modules\Club\Application\DTOs\CreateEquipUsuariDTO;
use App\Modules\Club\Application\DTOs\UpdateEquipUsuariDTO;

// --- Queries: classes que executen consultes de lectura ---
use App\Modules\Club\Application\Queries\GetClubsQuery;
use App\Modules\Club\Application\Queries\GetClubQuery;
use App\Modules\Club\Application\Queries\GetEquipsByClubQuery;
use App\Modules\Club\Application\Queries\GetEquipQuery;
use App\Modules\Club\Application\Queries\GetEquipMembresQuery;

// --- Excepcions de domini ---
use App\Modules\Club\Domain\Exceptions\ClubNotFoundException;
use App\Modules\Club\Domain\Exceptions\EquipNotFoundException;
use App\Modules\Club\Domain\Exceptions\EquipUsuariNotFoundException;

// --- Requests de validació ---
use App\Modules\Club\Presentation\Http\Requests\CreateClubRequest;
use App\Modules\Club\Presentation\Http\Requests\UpdateClubRequest;
use App\Modules\Club\Presentation\Http\Requests\CreateEquipRequest;
use App\Modules\Club\Presentation\Http\Requests\UpdateEquipRequest;
use App\Modules\Club\Presentation\Http\Requests\CreateEquipUsuariRequest;
use App\Modules\Club\Presentation\Http\Requests\UpdateEquipUsuariRequest;

// --- Resources per formatejar la resposta JSON ---
use App\Modules\Club\Presentation\Http\Resources\ClubResource;
use App\Modules\Club\Presentation\Http\Resources\EquipResource;
use App\Modules\Club\Presentation\Http\Resources\EquipUsuariResource;
use App\Models\UsuariRol;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tymon\JWTAuth\Facades\JWTAuth;

/**
 * Controlador del mòdul Club.
 * Gestiona totes les peticions HTTP per a clubs, equips i membres d'equip.
 * Segueix el patró CQRS: Commands per escriure, Queries per llegir.
 * Laravel injecta automàticament totes les dependències al constructor.
 */
class ClubController extends Controller
{
    public function __construct(
        // Commands de Club
        private CreateClubCommand $createClubCommand,
        private UpdateClubCommand $updateClubCommand,
        private DestroyClubCommand $destroyClubCommand,
        // Commands d'Equip
        private CreateEquipCommand $createEquipCommand,
        private UpdateEquipCommand $updateEquipCommand,
        private DestroyEquipCommand $destroyEquipCommand,
        // Commands de Membres d'Equip
        private CreateEquipUsuariCommand $createEquipUsuariCommand,
        private UpdateEquipUsuariCommand $updateEquipUsuariCommand,
        private DestroyEquipUsuariCommand $destroyEquipUsuariCommand,
        // Queries
        private GetClubsQuery $getClubsQuery,
        private GetClubQuery $getClubQuery,
        private GetEquipsByClubQuery $getEquipsByClubQuery,
        private GetEquipQuery $getEquipQuery,
        private GetEquipMembresQuery $getEquipMembresQuery,
    ) {}

    private function resolveAuthUserId(Request $request): ?string
    {
        $userIdFromRequest = trim((string) $request->input('auth_user_id', ''));
        if ($userIdFromRequest !== '') {
            return $userIdFromRequest;
        }

        try {
            $userIdFromToken = JWTAuth::parseToken()->getPayload()->get('sub');
            $userIdFromToken = trim((string) $userIdFromToken);

            return $userIdFromToken !== '' ? $userIdFromToken : null;
        } catch (\Throwable) {
            return null;
        }
    }

    // =====================================================================
    // CLUB ENDPOINTS
    // =====================================================================

    /**
     * GET /clubs - Llistar tots els clubs actius
     */
    public function index(): JsonResponse
    {
        $clubs = $this->getClubsQuery->execute();

        return response()->json([
            'success' => true,
            'data' => ClubResource::collection($clubs)
        ]);
    }

    /**
     * GET /clubs/{id} - Obtenir un club per ID amb els seus equips
     */
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

    /**
     * POST /clubs - Crear un nou club
     */
    public function store(CreateClubRequest $request): JsonResponse
    {
        try {
            $authUserId = $this->resolveAuthUserId($request);

            if ($authUserId === null) {
                return response()->json([
                    'success' => false,
                    'message' => 'No autenticat'
                ], 401);
            }

            $validated = $request->validated();
            $validated['creadorId'] = $authUserId;

            // Convertim les dades validades a un DTO
            $dto = CreateClubDTO::fromArray($validated);
            // Executem el command que crea el club
            $clubId = $this->createClubCommand->execute($dto);

            UsuariRol::updateOrCreate(
                ['usuariId' => $authUserId, 'rol' => 'ADMIN_CLUB'],
                ['isActive' => true]
            );

            return response()->json([
                'success' => true,
                'message' => 'Club creat correctament',
                'data' => ['id' => $clubId]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'exception' => get_class($e),
                'debug' => env('APP_DEBUG')
            ], 400);
        }
    }

    /**
     * PUT /clubs/{id} - Actualitzar un club
     */
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
                'message' => $e->getMessage(),
                'exception' => get_class($e),
                'debug' => env('APP_DEBUG')
            ], 400);
        }
    }

    /**
     * DELETE /clubs/{id} - Eliminar (soft delete) un club
     */
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
                'message' => $e->getMessage(),
                'exception' => get_class($e),
                'debug' => env('APP_DEBUG')
            ], 400);
        }
    }

    // =====================================================================
    // EQUIP ENDPOINTS (dins d'un club)
    // =====================================================================

    /**
     * GET /clubs/{clubId}/equips - Llistar equips d'un club
     */
    public function indexEquips(string $clubId): JsonResponse
    {
        try {
            $equips = $this->getEquipsByClubQuery->execute($clubId);

            return response()->json([
                'success' => true,
                'data' => EquipResource::collection($equips)
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

    /**
     * GET /clubs/{clubId}/equips/{equipId} - Obtenir un equip concret
     */
    public function showEquip(string $clubId, string $equipId): JsonResponse
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

    /**
     * POST /clubs/{clubId}/equips - Crear un equip dins d'un club
     */
    public function storeEquip(string $clubId, CreateEquipRequest $request): JsonResponse
    {
        try {
            $authUserId = $this->resolveAuthUserId($request);

            if ($authUserId === null) {
                return response()->json([
                    'success' => false,
                    'message' => 'No autenticat'
                ], 401);
            }

            $club = $this->getClubQuery->execute($clubId);

            $isAdminWeb = UsuariRol::where('usuariId', $authUserId)
                ->where('rol', 'ADMIN_WEB')
                ->where('isActive', true)
                ->exists();

            if (($club->creadorId ?? null) !== $authUserId && !$isAdminWeb) {
                return response()->json([
                    'success' => false,
                    'message' => 'Només l\'administrador del club pot crear equips en aquest club'
                ], 403);
            }

            $isEntrenador = UsuariRol::where('usuariId', $authUserId)
                ->where('rol', 'ENTRENADOR')
                ->where('isActive', true)
                ->exists();

            $rolEquip = $isEntrenador ? 'entrenador' : 'delegat';

            $equipId = DB::transaction(function () use ($request, $clubId, $authUserId, $rolEquip) {
                $dto = CreateEquipDTO::fromArray(array_merge(
                    $request->validated(),
                    ['clubId' => $clubId]
                ));

                $createdEquipId = $this->createEquipCommand->execute($dto);

                $membreDto = CreateEquipUsuariDTO::fromArray([
                    'equipId' => $createdEquipId,
                    'usuariId' => $authUserId,
                    'rolEquip' => $rolEquip,
                ]);

                $this->createEquipUsuariCommand->execute($membreDto, $clubId);

                return $createdEquipId;
            });

            return response()->json([
                'success' => true,
                'message' => 'Equip creat correctament',
                'data' => ['id' => $equipId]
            ], 201);
        } catch (ClubNotFoundException $e) {
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

    /**
     * PUT /clubs/{clubId}/equips/{equipId} - Actualitzar un equip
     */
    public function updateEquip(string $clubId, string $equipId, UpdateEquipRequest $request): JsonResponse
    {
        try {
            $dto = UpdateEquipDTO::fromArray($request->validated());
            $this->updateEquipCommand->execute($equipId, $clubId, $dto);

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
                'message' => $e->getMessage(),
                'exception' => get_class($e),
                'debug' => env('APP_DEBUG')
            ], 400);
        }
    }

    /**
     * POST /clubs/{clubId}/equips/{equipId}/inscripcio-lliga - Inscriure equip a una lliga
     */
    public function inscriureEquipALliga(string $clubId, string $equipId, Request $request): JsonResponse
    {
        try {
            $authUserId = $this->resolveAuthUserId($request);

            if ($authUserId === null) {
                return response()->json([
                    'success' => false,
                    'message' => 'No autenticat'
                ], 401);
            }

            $lligaId = trim((string) $request->input('lligaId', ''));

            if ($lligaId === '') {
                return response()->json([
                    'success' => false,
                    'message' => "La lliga és obligatòria"
                ], 422);
            }

            $equip = \App\Models\Equip::query()
                ->where('id', $equipId)
                ->where('clubId', $clubId)
                ->where('isActive', true)
                ->first();

            if (!$equip) {
                return response()->json([
                    'success' => false,
                    'message' => "L'equip no existeix o no pertany al club"
                ], 404);
            }

            $activeRoles = UsuariRol::query()
                ->where('usuariId', $authUserId)
                ->where('isActive', true)
                ->pluck('rol')
                ->map(fn(string $rol) => strtoupper($rol))
                ->toArray();

            $isAdminWeb = in_array('ADMIN_WEB', $activeRoles, true);
            $isAdminClubOwner = in_array('ADMIN_CLUB', $activeRoles, true)
                && DB::table('clubs')
                ->where('id', $clubId)
                ->where('creadorId', $authUserId)
                ->exists();
            $isTrainerOfTeam = in_array('ENTRENADOR', $activeRoles, true)
                && DB::table('equip_usuaris')
                ->where('equipId', $equipId)
                ->where('usuariId', $authUserId)
                ->whereRaw('LOWER(rolEquip) = ?', ['entrenador'])
                ->exists();

            if (!$isAdminWeb && !$isAdminClubOwner && !$isTrainerOfTeam) {
                return response()->json([
                    'success' => false,
                    'message' => "No tens permisos per inscriure aquest equip"
                ], 403);
            }

            $lliga = null;
            if (Schema::hasTable('lligues')) {
                $lliga = DB::table('lligues')
                    ->where('id', $lligaId)
                    ->where('isActive', true)
                    ->first();
            }

            if (!$lliga && Schema::hasTable('lligas')) {
                $lliga = DB::table('lligas')
                    ->where('id', $lligaId)
                    ->where('isActive', true)
                    ->first();
            }

            if (!$lliga) {
                return response()->json([
                    'success' => false,
                    'message' => 'La lliga indicada no existeix'
                ], 404);
            }

            $equipCategoria = mb_strtoupper(trim((string) $equip->categoria));
            $lligaCategoria = mb_strtoupper(trim((string) ($lliga->categoria ?? '')));

            if ($equipCategoria !== '' && $lligaCategoria !== '' && $equipCategoria !== $lligaCategoria) {
                return response()->json([
                    'success' => false,
                    'message' => 'La categoria de la lliga no coincideix amb la de l\'equip'
                ], 422);
            }

            $equip->lligaId = $lligaId;
            $equip->save();

            return response()->json([
                'success' => true,
                'message' => 'Equip inscrit correctament a la lliga',
                'data' => [
                    'equipId' => $equipId,
                    'lligaId' => $lligaId,
                ]
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

    /**
     * DELETE /clubs/{clubId}/equips/{equipId} - Eliminar un equip
     */
    public function destroyEquip(string $clubId, string $equipId): JsonResponse
    {
        try {
            $this->destroyEquipCommand->execute($equipId, $clubId);

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
                'message' => $e->getMessage(),
                'exception' => get_class($e),
                'debug' => env('APP_DEBUG')
            ], 400);
        }
    }

    // =====================================================================
    // EQUIP MEMBRES (equip_usuaris) ENDPOINTS
    // =====================================================================

    /**
     * GET /clubs/{clubId}/equips/{equipId}/membres - Llistar membres d'un equip
     */
    public function indexMembres(string $clubId, string $equipId): JsonResponse
    {
        try {
            $membres = $this->getEquipMembresQuery->execute($equipId);

            return response()->json([
                'success' => true,
                'data' => EquipUsuariResource::collection($membres)
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

    /**
     * POST /clubs/{clubId}/equips/{equipId}/membres - Afegir un membre a l'equip
     */
    public function storeMembre(string $clubId, string $equipId, CreateEquipUsuariRequest $request): JsonResponse
    {
        try {
            // Combinem l'equipId de la ruta amb les dades del body
            $dto = CreateEquipUsuariDTO::fromArray(array_merge(
                $request->validated(),
                ['equipId' => $equipId]
            ));
            $membreId = $this->createEquipUsuariCommand->execute($dto, $clubId);

            return response()->json([
                'success' => true,
                'message' => 'Membre afegit correctament',
                'data' => ['id' => $membreId]
            ], 201);
        } catch (EquipNotFoundException $e) {
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

    /**
     * PUT /clubs/{clubId}/equips/{equipId}/membres/{membreId} - Actualitzar un membre
     */
    public function updateMembre(string $clubId, string $equipId, string $membreId, UpdateEquipUsuariRequest $request): JsonResponse
    {
        try {
            $dto = UpdateEquipUsuariDTO::fromArray($request->validated());
            $this->updateEquipUsuariCommand->execute($membreId, $equipId, $dto);

            return response()->json([
                'success' => true,
                'message' => 'Membre actualitzat correctament'
            ]);
        } catch (EquipUsuariNotFoundException $e) {
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

    /**
     * DELETE /clubs/{clubId}/equips/{equipId}/membres/{membreId} - Eliminar un membre
     */
    public function destroyMembre(string $clubId, string $equipId, string $membreId): JsonResponse
    {
        try {
            $this->destroyEquipUsuariCommand->execute($membreId, $equipId);

            return response()->json([
                'success' => true,
                'message' => 'Membre eliminat correctament'
            ]);
        } catch (EquipUsuariNotFoundException $e) {
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
}
