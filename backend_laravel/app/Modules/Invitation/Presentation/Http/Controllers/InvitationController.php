<?php

namespace App\Modules\Invitation\Presentation\Http\Controllers;

use App\Modules\Invitation\Application\Commands\CreateInvitacioEquipCommand;
use App\Modules\Invitation\Application\Commands\UpdateInvitacioEquipCommand;
use App\Modules\Invitation\Application\Commands\DestroyInvitacioEquipCommand;
use App\Modules\Invitation\Application\Commands\RespondreInvitacioCommand;
use App\Modules\Invitation\Application\DTOs\CreateInvitacioEquipDTO;
use App\Modules\Invitation\Application\DTOs\UpdateInvitacioEquipDTO;
use App\Modules\Invitation\Application\Queries\GetInvitacionsQuery;
use App\Modules\Invitation\Application\Queries\GetInvitacioQuery;
use App\Modules\Invitation\Application\Queries\GetInvitacionsByEquipQuery;
use App\Modules\Invitation\Application\Queries\GetInvitacionsByUsuariQuery;
use App\Modules\Invitation\Application\Queries\GetPendentsByUsuariQuery;
use App\Modules\Invitation\Domain\Exceptions\InvitacioEquipNotFoundException;
use App\Modules\Invitation\Domain\Exceptions\InvalidInvitacioEstatException;
use App\Modules\Invitation\Domain\Exceptions\DuplicateInvitacioException;
use App\Modules\Invitation\Presentation\Http\Requests\CreateInvitacioEquipRequest;
use App\Modules\Invitation\Presentation\Http\Requests\UpdateInvitacioEquipRequest;
use App\Modules\Invitation\Presentation\Http\Requests\RespondreInvitacioRequest;
use App\Modules\Invitation\Presentation\Http\Resources\InvitacioEquipResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class InvitationController extends Controller
{
    public function __construct(
        private CreateInvitacioEquipCommand $createInvitacioCommand,
        private UpdateInvitacioEquipCommand $updateInvitacioCommand,
        private DestroyInvitacioEquipCommand $destroyInvitacioCommand,
        private RespondreInvitacioCommand $respondreInvitacioCommand,
        private GetInvitacionsQuery $getInvitacionsQuery,
        private GetInvitacioQuery $getInvitacioQuery,
        private GetInvitacionsByEquipQuery $getByEquipQuery,
        private GetInvitacionsByUsuariQuery $getByUsuariQuery,
        private GetPendentsByUsuariQuery $getPendentsQuery,
    ) {}

    public function indexInvitacions(): JsonResponse
    {
        $invitacions = $this->getInvitacionsQuery->execute();

        return response()->json([
            'success' => true,
            'data' => InvitacioEquipResource::collection($invitacions)
        ]);
    }

    public function showInvitacio(string $id): JsonResponse
    {
        try {
            $invitacio = $this->getInvitacioQuery->execute($id);

            return response()->json([
                'success' => true,
                'data' => new InvitacioEquipResource($invitacio)
            ]);
        } catch (InvitacioEquipNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        }
    }

    public function invitacionsByEquip(string $equipId): JsonResponse
    {
        $invitacions = $this->getByEquipQuery->execute($equipId);

        return response()->json([
            'success' => true,
            'data' => InvitacioEquipResource::collection($invitacions)
        ]);
    }

    public function invitacionsByUsuari(string $usuariId): JsonResponse
    {
        $invitacions = $this->getByUsuariQuery->execute($usuariId);

        return response()->json([
            'success' => true,
            'data' => InvitacioEquipResource::collection($invitacions)
        ]);
    }

    public function pendentsByUsuari(string $usuariId): JsonResponse
    {
        $invitacions = $this->getPendentsQuery->execute($usuariId);

        return response()->json([
            'success' => true,
            'data' => InvitacioEquipResource::collection($invitacions)
        ]);
    }

    public function storeInvitacio(CreateInvitacioEquipRequest $request): JsonResponse
    {
        try {
            $dto = CreateInvitacioEquipDTO::fromArray($request->validated());
            $invitacioId = $this->createInvitacioCommand->execute($dto);

            return response()->json([
                'success' => true,
                'message' => 'Invitació creada correctament',
                'data' => ['id' => $invitacioId]
            ], 201);
        } catch (DuplicateInvitacioException $e) {
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

    public function updateInvitacio(UpdateInvitacioEquipRequest $request, string $id): JsonResponse
    {
        try {
            $dto = UpdateInvitacioEquipDTO::fromArray($request->validated());
            $this->updateInvitacioCommand->execute($id, $dto);

            return response()->json([
                'success' => true,
                'message' => 'Invitació actualitzada correctament'
            ]);
        } catch (InvitacioEquipNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        } catch (InvalidInvitacioEstatException $e) {
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

    public function respondreInvitacio(RespondreInvitacioRequest $request, string $id): JsonResponse
    {
        try {
            $resposta = $request->validated()['estat'];
            $this->respondreInvitacioCommand->execute($id, $resposta);

            return response()->json([
                'success' => true,
                'message' => "Invitació $resposta correctament"
            ]);
        } catch (InvitacioEquipNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        } catch (InvalidInvitacioEstatException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        }
    }

    public function destroyInvitacio(string $id): JsonResponse
    {
        try {
            $this->destroyInvitacioCommand->execute($id);

            return response()->json([
                'success' => true,
                'message' => 'Invitació eliminada correctament'
            ]);
        } catch (InvitacioEquipNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode());
        }
    }
}
