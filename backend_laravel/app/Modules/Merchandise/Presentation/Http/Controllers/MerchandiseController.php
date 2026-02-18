<?php

namespace App\Modules\Merchandise\Presentation\Http\Controllers;

use App\Modules\Merchandise\Application\Commands\CreateMerchCommand;
use App\Modules\Merchandise\Application\Commands\UpdateMerchCommand;
use App\Modules\Merchandise\Application\Commands\DestroyMerchCommand;
use App\Modules\Merchandise\Application\Commands\CreateCompraCommand;
use App\Modules\Merchandise\Application\Commands\UpdateCompraCommand;
use App\Modules\Merchandise\Application\Commands\DestroyCompraCommand;
use App\Modules\Merchandise\Application\DTOs\CreateMerchDTO;
use App\Modules\Merchandise\Application\DTOs\UpdateMerchDTO;
use App\Modules\Merchandise\Application\DTOs\CreateCompraDTO;
use App\Modules\Merchandise\Application\DTOs\UpdateCompraDTO;
use App\Modules\Merchandise\Application\Queries\GetMerchsQuery;
use App\Modules\Merchandise\Application\Queries\GetMerchQuery;
use App\Modules\Merchandise\Application\Queries\GetComprasQuery;
use App\Modules\Merchandise\Application\Queries\GetCompraQuery;
use App\Modules\Merchandise\Application\Queries\GetComprasByUsuariQuery;
use App\Modules\Merchandise\Application\Queries\GetComprasByMerchQuery;
use App\Modules\Merchandise\Application\Queries\SearchMerchQuery;
use App\Modules\Merchandise\Domain\Exceptions\MerchNotFoundException;
use App\Modules\Merchandise\Domain\Exceptions\CompraNotFoundException;
use App\Modules\Merchandise\Domain\Exceptions\InsufficientStockException;
use App\Modules\Merchandise\Presentation\Http\Requests\CreateMerchRequest;
use App\Modules\Merchandise\Presentation\Http\Requests\UpdateMerchRequest;
use App\Modules\Merchandise\Presentation\Http\Requests\CreateCompraRequest;
use App\Modules\Merchandise\Presentation\Http\Requests\UpdateCompraRequest;
use App\Modules\Merchandise\Presentation\Http\Resources\MerchResource;
use App\Modules\Merchandise\Presentation\Http\Resources\CompraResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class MerchandiseController extends Controller
{
    public function __construct(
        private CreateMerchCommand $createMerchCommand,
        private UpdateMerchCommand $updateMerchCommand,
        private DestroyMerchCommand $destroyMerchCommand,
        private CreateCompraCommand $createCompraCommand,
        private UpdateCompraCommand $updateCompraCommand,
        private DestroyCompraCommand $destroyCompraCommand,
        private GetMerchsQuery $getMerchsQuery,
        private GetMerchQuery $getMerchQuery,
        private GetComprasQuery $getComprasQuery,
        private GetCompraQuery $getCompraQuery,
        private GetComprasByUsuariQuery $getComprasByUsuariQuery,
        private GetComprasByMerchQuery $getComprasByMerchQuery,
        private SearchMerchQuery $searchMerchQuery
    ) {}

    public function indexMerchs(Request $request): JsonResponse
    {
        $q = $request->query('q');
        $marca = $request->query('marca');
        $minPrice = $request->query('minPrice');
        $maxPrice = $request->query('maxPrice');
        $sort = $request->query('sort', 'id');
        $page = (int) $request->query('page', 1);
        $limit = (int) $request->query('limit', 20);

        $result = $this->searchMerchQuery->execute(
            q: $q,
            marca: $marca,
            minPrice: $minPrice,
            maxPrice: $maxPrice,
            sort: $sort,
            page: $page,
            limit: $limit
        );

        return response()->json([
            'success' => true,
            'data' => MerchResource::collection($result['data']),
            'current_page' => $result['current_page'],
            'per_page'     => $result['per_page'],
            'last_page'    => $result['last_page'],
            'total'        => $result['total'],
        ]);
        // $merchs = $this->getMerchsQuery->execute();

        // return response()->json([
        //     'success' => true,
        //     'data' => MerchResource::collection($merchs)
        // ]);
    }

    public function showMerch(string $id): JsonResponse
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

    public function storeMerch(CreateMerchRequest $request): JsonResponse
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

    public function updateMerch(UpdateMerchRequest $request, string $id): JsonResponse
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

    public function destroyMerch(string $id): JsonResponse
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
        }
    }

    public function indexCompras(): JsonResponse
    {
        $compras = $this->getComprasQuery->execute();

        return response()->json([
            'success' => true,
            'data' => CompraResource::collection($compras)
        ]);
    }

    public function showCompra(string $id): JsonResponse
    {
        try {
            $compra = $this->getCompraQuery->execute($id);

            return response()->json([
                'success' => true,
                'data' => new CompraResource($compra)
            ]);
        } catch (CompraNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        }
    }

    public function comprasByUsuari(string $usuariId): JsonResponse
    {
        $compras = $this->getComprasByUsuariQuery->execute($usuariId);

        return response()->json([
            'success' => true,
            'data' => CompraResource::collection($compras)
        ]);
    }

    public function comprasByMerch(string $merchId): JsonResponse
    {
        $compras = $this->getComprasByMerchQuery->execute($merchId);

        return response()->json([
            'success' => true,
            'data' => CompraResource::collection($compras)
        ]);
    }

    public function storeCompra(CreateCompraRequest $request): JsonResponse
    {
        try {
            $dto = CreateCompraDTO::fromArray($request->validated());
            $compraId = $this->createCompraCommand->execute($dto);

            return response()->json([
                'success' => true,
                'message' => 'Compra creada correctament',
                'data' => ['id' => $compraId]
            ], 201);
        } catch (MerchNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        } catch (InsufficientStockException $e) {
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

    public function updateCompra(UpdateCompraRequest $request, string $id): JsonResponse
    {
        try {
            $dto = UpdateCompraDTO::fromArray($request->validated());
            $this->updateCompraCommand->execute($id, $dto);

            return response()->json([
                'success' => true,
                'message' => 'Compra actualitzada correctament'
            ]);
        } catch (CompraNotFoundException $e) {
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

    public function destroyCompra(string $id): JsonResponse
    {
        try {
            $this->destroyCompraCommand->execute($id);

            return response()->json([
                'success' => true,
                'message' => 'Compra eliminada correctament'
            ]);
        } catch (CompraNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        }
    }

    public function getBrands(): JsonResponse
    {
        $brands = \App\Enums\MerchBrand::options();

        return response()->json([
            'success' => true,
            'data' => $brands
        ]);
    }
}
