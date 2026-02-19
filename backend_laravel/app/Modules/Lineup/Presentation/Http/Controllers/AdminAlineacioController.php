<?php

namespace App\Modules\Lineup\Presentation\Http\Controllers;

use App\Modules\Lineup\Application\Commands\CreateAlineacioCommand;
use App\Modules\Lineup\Application\Commands\UpdateAlineacioAdminCommand;
use App\Modules\Lineup\Application\Commands\DestroyAlineacioAdminCommand;
use App\Modules\Lineup\Application\DTOs\CreateAlineacioDTO;
use App\Modules\Lineup\Application\DTOs\UpdateAlineacioDTO;
use App\Modules\Lineup\Application\Queries\GetAlineacionsAdminQuery;
use App\Modules\Lineup\Application\Queries\GetAlineacioAdminQuery;
use App\Modules\Lineup\Domain\Exceptions\AlineacioNotFoundException;
use App\Modules\Lineup\Domain\Exceptions\DuplicateAlineacioException;
use App\Modules\Lineup\Presentation\Http\Requests\CreateAlineacioRequest;
use App\Modules\Lineup\Presentation\Http\Requests\UpdateAlineacioRequest;
use App\Modules\Lineup\Presentation\Http\Resources\AlineacioResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class AdminAlineacioController extends Controller
{
    public function __construct(
        private CreateAlineacioCommand $createCommand,
        private UpdateAlineacioAdminCommand $updateCommand,
        private DestroyAlineacioAdminCommand $destroyCommand,
        private GetAlineacionsAdminQuery $getAlineacionsQuery,
        private GetAlineacioAdminQuery $getAlineacioQuery,
    ) {}

    public function index(): JsonResponse
    {
        $alineacions = $this->getAlineacionsQuery->execute();

        return response()->json([
            'success' => true,
            'data' => AlineacioResource::collection($alineacions)
        ]);
    }

    public function show(string $id): JsonResponse
    {
        try {
            $alineacio = $this->getAlineacioQuery->execute($id);

            return response()->json([
                'success' => true,
                'data' => new AlineacioResource($alineacio)
            ]);
        } catch (AlineacioNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        }
    }

    public function store(CreateAlineacioRequest $request): JsonResponse
    {
        try {
            $dto = CreateAlineacioDTO::fromArray($request->validated());
            $alineacioId = $this->createCommand->execute($dto);

            return response()->json([
                'success' => true,
                'message' => 'Alineació creada correctament',
                'data' => ['id' => $alineacioId]
            ], 201);
        } catch (DuplicateAlineacioException $e) {
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

    public function update(UpdateAlineacioRequest $request, string $id): JsonResponse
    {
        try {
            $dto = UpdateAlineacioDTO::fromArray($request->validated());
            $this->updateCommand->execute($id, $dto);

            return response()->json([
                'success' => true,
                'message' => 'Alineació actualitzada correctament'
            ]);
        } catch (AlineacioNotFoundException $e) {
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
            $this->destroyCommand->execute($id);

            return response()->json([
                'success' => true,
                'message' => 'Alineació eliminada correctament'
            ]);
        } catch (AlineacioNotFoundException $e) {
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
}
