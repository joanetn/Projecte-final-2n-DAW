<?php

namespace App\Modules\Merchandise\Presentation\Http\Controllers;

use App\Modules\Merchandise\Application\Commands\CreateMerchCommand;
use App\Modules\Merchandise\Application\Commands\UpdateMerchAdminCommand;
use App\Modules\Merchandise\Application\Commands\DestroyMerchAdminCommand;
use App\Modules\Merchandise\Application\DTOs\CreateMerchDTO;
use App\Modules\Merchandise\Application\DTOs\UpdateMerchDTO;
use App\Modules\Merchandise\Application\Queries\GetMerchAdminQuery;
use App\Modules\Merchandise\Application\Queries\GetMerchsAdminQuery;
use App\Modules\Merchandise\Domain\Exceptions\MerchNotFoundException;
use App\Modules\Merchandise\Presentation\Http\Requests\CreateMerchRequest;
use App\Modules\Merchandise\Presentation\Http\Requests\UpdateMerchRequest;
use App\Modules\Merchandise\Presentation\Http\Resources\MerchResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class AdminMerchandiseController extends Controller
{
    public function __construct(
        private CreateMerchCommand $createMerchCommand,
        private UpdateMerchAdminCommand $updateMerchCommand,
        private DestroyMerchAdminCommand $destroyMerchCommand,
        private GetMerchAdminQuery $getMerchQuery,
        private GetMerchsAdminQuery $getMerchsQuery,
    ) {}

    public function index(): JsonResponse
    {
        $merchs = $this->getMerchsQuery->execute();

        return response()->json([
            'success' => true,
            'data' => MerchResource::collection($merchs)
        ]);
    }

    public function show(string $id): JsonResponse
    {
        try {
            $merch = $this->getMerchQuery->execute($id);

            return response()->json([
                'success' => true,
                'data' => new MerchResource($merch)
            ]);
        } catch (MerchNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        }
    }

    public function store(CreateMerchRequest $request): JsonResponse
    {
        try {
            $dto = CreateMerchDTO::fromArray($request->validated());
            $merchId = $this->createMerchCommand->execute($dto);

            return response()->json([
                'success' => true,
                'message' => 'Producte creat correctament',
                'data' => ['id' => $merchId]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function update(UpdateMerchRequest $request, string $id): JsonResponse
    {
        try {
            $dto = UpdateMerchDTO::fromArray($request->validated());
            $this->updateMerchCommand->execute($id, $dto);

            return response()->json([
                'success' => true,
                'message' => 'Producte actualitzat correctament'
            ]);
        } catch (MerchNotFoundException $e) {
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
            $this->destroyMerchCommand->execute($id);

            return response()->json([
                'success' => true,
                'message' => 'Producte eliminat correctament'
            ]);
        } catch (MerchNotFoundException $e) {
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
