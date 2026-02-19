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
use App\Modules\Club\Presentation\Http\Resources\EquipUsuariResource;
use Illuminate\Http\JsonResponse;
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

    public function indexMembres(string $equipId): JsonResponse
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
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
