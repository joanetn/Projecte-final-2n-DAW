<?php

namespace App\Modules\Lineup\Presentation\Http\Controllers;

use App\Modules\Lineup\Application\Commands\CreateAlineacioCommand;
use App\Modules\Lineup\Application\Commands\UpdateAlineacioCommand;
use App\Modules\Lineup\Application\Commands\DestroyAlineacioCommand;
use App\Modules\Lineup\Application\DTOs\CreateAlineacioDTO;
use App\Modules\Lineup\Application\DTOs\UpdateAlineacioDTO;
use App\Modules\Lineup\Application\Queries\GetAlineacionsQuery;
use App\Modules\Lineup\Application\Queries\GetAlineacioQuery;
use App\Modules\Lineup\Application\Queries\GetAlineacionsByPartitQuery;
use App\Modules\Lineup\Domain\Exceptions\AlineacioNotFoundException;
use App\Modules\Lineup\Domain\Exceptions\DuplicateAlineacioException;
use App\Modules\Lineup\Presentation\Http\Requests\CreateAlineacioRequest;
use App\Modules\Lineup\Presentation\Http\Requests\UpdateAlineacioRequest;
use App\Modules\Lineup\Presentation\Http\Resources\AlineacioResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class AlineacioController extends Controller
{
    public function __construct(
        private CreateAlineacioCommand $createCommand,
        private UpdateAlineacioCommand $updateCommand,
        private DestroyAlineacioCommand $destroyCommand,
        private GetAlineacionsQuery $getAlineacionsQuery,
        private GetAlineacioQuery $getAlineacioQuery,
        private GetAlineacionsByPartitQuery $getByPartitQuery
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
            $alineacio = $this->getAlineacioQuery->execute(alineacioId: $id);
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

    public function byPartit(string $partitId): JsonResponse
    {
        $alineacions = $this->getByPartitQuery->execute($partitId);
        return response()->json([
            'success' => true,
            'data' => AlineacioResource::collection($alineacions)
        ]);
    }

    public function store(CreateAlineacioRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            if (!empty($validated['jugadors']) && is_array($validated['jugadors'])) {
                $partitId = $validated['partitId'];
                $equipId = $validated['equipId'];
                $jugadorsPayload = collect($validated['jugadors'])
                    ->map(fn(array $jugador) => [
                        'jugadorId' => $jugador['jugadorId'] ?? $jugador['id'] ?? null,
                        'posicio' => $jugador['posicio'] ?? null,
                    ])
                    ->filter(fn(array $jugador) => !empty($jugador['jugadorId']))
                    ->values()
                    ->all();

                $existingAlineacions = array_filter(
                    $this->getByPartitQuery->execute($partitId),
                    fn($alineacio) => $alineacio->equipId === $equipId && $alineacio->isActive()
                );

                $existingByJugador = [];
                foreach ($existingAlineacions as $alineacio) {
                    $existingByJugador[$alineacio->jugadorId] = $alineacio;
                }

                $incomingJugadorIds = [];
                $savedIds = [];

                foreach ($jugadorsPayload as $jugadorData) {
                    $jugadorId = $jugadorData['jugadorId'];
                    if (in_array($jugadorId, $incomingJugadorIds, true)) {
                        continue;
                    }

                    $incomingJugadorIds[] = $jugadorId;
                    $posicio = $jugadorData['posicio'] ?? null;

                    if (isset($existingByJugador[$jugadorId])) {
                        $alineacio = $existingByJugador[$jugadorId];
                        if ($alineacio->posicio !== $posicio) {
                            $updateDto = UpdateAlineacioDTO::fromArray(['posicio' => $posicio]);
                            $this->updateCommand->execute($alineacio->id, $updateDto);
                        }

                        $savedIds[] = $alineacio->id;
                        continue;
                    }

                    $createDto = CreateAlineacioDTO::fromArray([
                        'partitId' => $partitId,
                        'equipId' => $equipId,
                        'jugadorId' => $jugadorId,
                        'posicio' => $posicio,
                    ]);

                    $savedIds[] = $this->createCommand->execute($createDto);
                }

                foreach ($existingAlineacions as $alineacio) {
                    if (!in_array($alineacio->jugadorId, $incomingJugadorIds, true)) {
                        $this->destroyCommand->execute($alineacio->id);
                    }
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Alineació guardada correctament',
                    'data' => ['ids' => $savedIds]
                ]);
            }

            $dto = CreateAlineacioDTO::fromArray($validated);
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
                'message' => "Error al crear l'alineació"
            ], 500);
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
                'message' => "Error al actualitzar l'alineació"
            ], 500);
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
                'message' => "Error al eliminar l'alineació"
            ], 500);
        }
    }
}
