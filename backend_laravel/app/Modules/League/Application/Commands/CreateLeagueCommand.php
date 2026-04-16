<?php

namespace App\Modules\League\Application\Commands;

use App\Models\Equip;
use App\Models\EquipUsuari;
use App\Modules\League\Application\DTOs\CreateLeagueDTO;
use App\Modules\League\Domain\Repositories\LeagueRepositoryInterface;
use App\Modules\League\Domain\Services\LeagueDomainService;
use App\Modules\Notifications\Application\Commands\EnqueueNotificationCommand;
use App\Modules\Notifications\Application\Commands\ProcessNextCommand;
use App\Modules\Notifications\Application\DTOs\EnqueueNotificationDTO;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class CreateLeagueCommand
{
    public function __construct(
        private LeagueRepositoryInterface $leagueRepositoryInterface,
        private LeagueDomainService $leagueDomainService,
        private EnqueueNotificationCommand $enqueueNotificationCommand,
        private ProcessNextCommand $processNextCommand
    ) {}

    public function execute(CreateLeagueDTO $dto): string
    {
        $this->leagueDomainService->validLeagueIniDate($dto->dataInici);
        $this->leagueDomainService->validLeagueEndDate($dto->dataInici, $dto->dataFi);

        $result = DB::transaction(function () use ($dto): array {
            $this->acquireCreateLeagueLock($dto);

            // Idempotencia: si ya existe una liga activa con la misma firma funcional, reutilizamos.
            $existingLeague = $this->leagueRepositoryInterface->findActiveByNomCategoriaAndStartDate(
                $dto->nom,
                $dto->categoria,
                $dto->dataInici
            );

            if ($existingLeague !== null) {
                return [
                    'leagueId' => $existingLeague->id,
                    'created' => false,
                ];
            }

            $league = $this->leagueRepositoryInterface->create([
                'id' => Str::uuid()->toString(),
                'nom' => $dto->nom,
                'categoria' => $dto->categoria,
                'dataInici' => $dto->dataInici,
                'status' => $dto->status,
                'dataFi' => $dto->dataFi,
                'isActive' => $dto->isActive,
            ]);

            return [
                'leagueId' => $league->id,
                'created' => true,
            ];
        });

        if ($result['created'] === true) {
            $this->dispatchLeagueNotification($dto, $result['leagueId']);
        }

        return $result['leagueId'];
    }

    private function acquireCreateLeagueLock(CreateLeagueDTO $dto): void
    {
        if (DB::connection()->getDriverName() !== 'pgsql') {
            return;
        }

        $normalizedDate = Carbon::parse($dto->dataInici)->toDateString();
        $signature = mb_strtolower(trim($dto->nom)) . '|' . mb_strtolower(trim($dto->categoria)) . '|' . $normalizedDate;

        // 60-bit key keeps integer safe in PHP and Postgres bigint.
        $lockId = (int) hexdec(substr(hash('sha256', $signature), 0, 15));
        DB::select('SELECT pg_advisory_xact_lock(?)', [$lockId]);
    }

    public function dispatchLeagueNotification(CreateLeagueDTO $dto, string $leagueId): void
    {
        try {
            $suceso = "Se ha creado una lliga nueva con el nombre: {$dto->nom} de la categoria: {$dto->categoria} que inicia el: {$dto->dataInici}. "
                . "El mensaje debe de ser genérico ya que va dirigido a los jugadores que esten en equipos de la misma categoria que la liga.";

            $equips = Equip::query()
                ->where('categoria', $dto->categoria)
                ->pluck('id')
                ->all();

            if (empty($equips)) {
                return;
            }

            $usuaris = EquipUsuari::query()
                ->whereIn('equipId', $equips)
                ->distinct()
                ->pluck('usuariId')
                ->all();

            if (empty($usuaris)) {
                return;
            }

            $batchKey = 'league-created:' . $leagueId;

            $enqueueDTO = EnqueueNotificationDTO::fromArray([
                'userIds' => $usuaris,
                'suceso' => $suceso,
                'channels' => ['Push', 'Email'],
                'tone' => 'PROFESIONAL',
                'batchKey' => $batchKey,
                'data' => [
                    'type' => 'league_created',
                    'lligaId' => $leagueId,
                    'nombre_liga' => $dto->nom,
                    'categoria_liga' => $dto->categoria,
                ],
            ]);

            $this->enqueueNotificationCommand->execute($enqueueDTO);

            $maxIterations = max(2, count($usuaris) + 2);
            for ($i = 0; $i < $maxIterations; $i++) {
                try {
                    $this->processNextCommand->execute();
                } catch (\RuntimeException $runtimeException) {
                    if ($runtimeException->getMessage() === 'No hay notificaciones pendientes') {
                        break;
                    }

                    throw $runtimeException;
                }
            }
        } catch (\Throwable $e) {
            Log::error('Error enviando notificación de creación de liga', [
                'leagueId' => $leagueId,
                'categoria' => $dto->categoria,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
