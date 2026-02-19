<?php

namespace App\Modules\Venue\Presentation\Http\Controllers;

use App\Modules\Venue\Application\Commands\CreateInstalacioCommand;
use App\Modules\Venue\Application\Commands\UpdateInstalacioAdminCommand;
use App\Modules\Venue\Application\Commands\DestroyInstalacioAdminCommand;
use App\Modules\Venue\Application\DTOs\CreateInstalacioDTO;
use App\Modules\Venue\Application\DTOs\UpdateInstalacioDTO;
use App\Modules\Venue\Application\Queries\GetInstalacioAdminQuery;
use App\Modules\Venue\Application\Queries\GetInstalacionsAdminQuery;
use App\Modules\Venue\Domain\Exceptions\InstalacioNotFoundException;
use App\Modules\Venue\Presentation\Http\Requests\CreateInstalacioRequest;
use App\Modules\Venue\Presentation\Http\Requests\UpdateInstalacioRequest;
use App\Modules\Venue\Presentation\Http\Resources\InstalacioResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class AdminVenueController extends Controller
{
    public function __construct(
        private CreateInstalacioCommand $createInstalacioCommand,
        private UpdateInstalacioAdminCommand $updateInstalacioCommand,
        private DestroyInstalacioAdminCommand $destroyInstalacioCommand,
        private GetInstalacioAdminQuery $getInstalacioQuery,
        private GetInstalacionsAdminQuery $getInstalacionsQuery,
    ) {}

    public function index(): JsonResponse
    {
        $instalacions = $this->getInstalacionsQuery->execute();

        return response()->json([
            'success' => true,
            'data' => InstalacioResource::collection($instalacions)
        ]);
    }

    public function show(string $id): JsonResponse
    {
        try {
            $instalacio = $this->getInstalacioQuery->execute($id);

            return response()->json([
                'success' => true,
                'data' => new InstalacioResource($instalacio)
            ]);
        } catch (InstalacioNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        }
    }

    public function store(CreateInstalacioRequest $request): JsonResponse
    {
        try {
            $dto = CreateInstalacioDTO::fromArray($request->validated());
            $instalacioId = $this->createInstalacioCommand->execute($dto);

            return response()->json([
                'success' => true,
                'message' => 'Instal·lació creada correctament',
                'data' => ['id' => $instalacioId]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function update(UpdateInstalacioRequest $request, string $id): JsonResponse
    {
        try {
            $dto = UpdateInstalacioDTO::fromArray($request->validated());
            $this->updateInstalacioCommand->execute($id, $dto);

            return response()->json([
                'success' => true,
                'message' => 'Instal·lació actualitzada correctament'
            ]);
        } catch (InstalacioNotFoundException $e) {
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
            $this->destroyInstalacioCommand->execute($id);

            return response()->json([
                'success' => true,
                'message' => 'Instal·lació eliminada correctament'
            ]);
        } catch (InstalacioNotFoundException $e) {
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
