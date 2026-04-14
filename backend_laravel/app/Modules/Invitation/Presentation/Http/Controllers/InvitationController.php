<?php

namespace App\Modules\Invitation\Presentation\Http\Controllers;

use App\Models\Club;
use App\Models\Equip;
use App\Models\EquipUsuari;
use App\Models\UsuariRol;
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
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Tymon\JWTAuth\Facades\JWTAuth;

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

    public function indexInvitacions(Request $request): JsonResponse
    {
        $authUserId = $this->resolveAuthUserId($request);
        if (!$authUserId) {
            return response()->json([
                'success' => false,
                'message' => 'No autenticat'
            ], 401);
        }

        if (!$this->isAdminWeb($authUserId)) {
            return response()->json([
                'success' => false,
                'message' => 'No tens permisos per consultar totes les invitacions'
            ], 403);
        }

        $invitacions = $this->getInvitacionsQuery->execute();

        return response()->json([
            'success' => true,
            'data' => InvitacioEquipResource::collection($invitacions)
        ]);
    }

    public function showInvitacio(Request $request, string $id): JsonResponse
    {
        try {
            $authUserId = $this->resolveAuthUserId($request);
            if (!$authUserId) {
                return response()->json([
                    'success' => false,
                    'message' => 'No autenticat'
                ], 401);
            }

            $invitacio = $this->getInvitacioQuery->execute($id);

            $isOwnInvitation = (string) $invitacio->usuariId === $authUserId;
            if (!$isOwnInvitation && !$this->canManageEquip($authUserId, (string) $invitacio->equipId)) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tens permisos per consultar aquesta invitació'
                ], 403);
            }

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

    public function invitacionsByEquip(Request $request, string $equipId): JsonResponse
    {
        $authUserId = $this->resolveAuthUserId($request);
        if (!$authUserId) {
            return response()->json([
                'success' => false,
                'message' => 'No autenticat'
            ], 401);
        }

        if (!$this->canManageEquip($authUserId, $equipId)) {
            return response()->json([
                'success' => false,
                'message' => 'No tens permisos per consultar invitacions d\'aquest equip'
            ], 403);
        }

        $invitacions = $this->getByEquipQuery->execute($equipId);

        return response()->json([
            'success' => true,
            'data' => InvitacioEquipResource::collection($invitacions)
        ]);
    }

    public function invitacionsByUsuari(Request $request, string $usuariId): JsonResponse
    {
        $authUserId = $this->resolveAuthUserId($request);
        if (!$authUserId) {
            return response()->json([
                'success' => false,
                'message' => 'No autenticat'
            ], 401);
        }

        if ($authUserId !== $usuariId && !$this->isAdminWeb($authUserId)) {
            return response()->json([
                'success' => false,
                'message' => 'No tens permisos per consultar les invitacions d\'aquest usuari'
            ], 403);
        }

        $invitacions = $this->getByUsuariQuery->execute($usuariId);

        return response()->json([
            'success' => true,
            'data' => InvitacioEquipResource::collection($invitacions)
        ]);
    }

    public function pendentsByUsuari(Request $request, string $usuariId): JsonResponse
    {
        $authUserId = $this->resolveAuthUserId($request);
        if (!$authUserId) {
            return response()->json([
                'success' => false,
                'message' => 'No autenticat'
            ], 401);
        }

        if ($authUserId !== $usuariId && !$this->isAdminWeb($authUserId)) {
            return response()->json([
                'success' => false,
                'message' => 'No tens permisos per consultar les invitacions pendents d\'aquest usuari'
            ], 403);
        }

        $invitacions = $this->getPendentsQuery->execute($usuariId);

        return response()->json([
            'success' => true,
            'data' => InvitacioEquipResource::collection($invitacions)
        ]);
    }

    public function storeInvitacio(CreateInvitacioEquipRequest $request): JsonResponse
    {
        try {
            $authUserId = $this->resolveAuthUserId($request);
            if (!$authUserId) {
                return response()->json([
                    'success' => false,
                    'message' => 'No autenticat'
                ], 401);
            }

            $dto = CreateInvitacioEquipDTO::fromArray([
                ...$request->validated(),
                'remitentId' => $authUserId,
            ]);

            if (!$this->canManageEquip($authUserId, $dto->equipId)) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tens permisos per enviar invitacions a aquest equip'
                ], 403);
            }

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
            $status = ($e->getCode() >= 400 && $e->getCode() < 600) ? $e->getCode() : 400;
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $status);
        }
    }

    public function updateInvitacio(UpdateInvitacioEquipRequest $request, string $id): JsonResponse
    {
        try {
            $authUserId = $this->resolveAuthUserId($request);
            if (!$authUserId) {
                return response()->json([
                    'success' => false,
                    'message' => 'No autenticat'
                ], 401);
            }

            $invitacio = $this->getInvitacioQuery->execute($id);
            if (!$this->canManageEquip($authUserId, (string) $invitacio->equipId)) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tens permisos per actualitzar aquesta invitació'
                ], 403);
            }

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
            $authUserId = $this->resolveAuthUserId($request);
            if (!$authUserId) {
                return response()->json([
                    'success' => false,
                    'message' => 'No autenticat'
                ], 401);
            }

            $invitacio = $this->getInvitacioQuery->execute($id);
            $isOwnInvitation = (string) $invitacio->usuariId === $authUserId;
            if (!$isOwnInvitation && !$this->isAdminWeb($authUserId)) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tens permisos per respondre aquesta invitació'
                ], 403);
            }

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
        } catch (\Exception $e) {
            $status = ($e->getCode() >= 400 && $e->getCode() < 600) ? $e->getCode() : 400;
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $status);
        }
    }

    public function destroyInvitacio(Request $request, string $id): JsonResponse
    {
        try {
            $authUserId = $this->resolveAuthUserId($request);
            if (!$authUserId) {
                return response()->json([
                    'success' => false,
                    'message' => 'No autenticat'
                ], 401);
            }

            $invitacio = $this->getInvitacioQuery->execute($id);
            if (!$this->canManageEquip($authUserId, (string) $invitacio->equipId)) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tens permisos per eliminar aquesta invitació'
                ], 403);
            }

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

    private function isAdminWeb(string $usuariId): bool
    {
        return UsuariRol::query()
            ->where('usuariId', $usuariId)
            ->where('rol', 'ADMIN_WEB')
            ->where('isActive', true)
            ->exists();
    }

    private function canManageEquip(string $usuariId, string $equipId): bool
    {
        if ($this->isAdminWeb($usuariId)) {
            return true;
        }

        $roles = UsuariRol::query()
            ->where('usuariId', $usuariId)
            ->where('isActive', true)
            ->pluck('rol')
            ->map(fn($rol) => strtoupper((string) $rol))
            ->values()
            ->all();

        $equip = Equip::query()
            ->where('id', $equipId)
            ->where('isActive', true)
            ->first(['id', 'clubId']);

        if (!$equip) {
            return false;
        }

        $ownsClub = false;
        if (!empty($equip->clubId)) {
            $ownsClub = Club::query()
                ->where('id', $equip->clubId)
                ->where('isActive', true)
                ->where('creadorId', $usuariId)
                ->exists();
        }

        $isTrainerInEquip = EquipUsuari::query()
            ->where('equipId', $equipId)
            ->where('usuariId', $usuariId)
            ->where('isActive', true)
            ->whereRaw('UPPER("rolEquip") = ?', ['ENTRENADOR'])
            ->exists();

        $isAdminClub = in_array('ADMIN_CLUB', $roles, true);
        $isEntrenador = in_array('ENTRENADOR', $roles, true);

        return ($isAdminClub && $ownsClub)
            || ($isEntrenador && ($ownsClub || $isTrainerInEquip));
    }
}
