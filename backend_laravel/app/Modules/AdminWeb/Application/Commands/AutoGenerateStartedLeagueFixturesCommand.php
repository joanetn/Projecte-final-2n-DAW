<?php

namespace App\Modules\AdminWeb\Application\Commands;

use App\Modules\AdminWeb\Application\DTOs\GenerateLeagueFixturesDTO;
use App\Models\Lliga;
use Illuminate\Support\Facades\Log;

/**
 * Command de mantenimiento para generar automáticamente fixtures
 * en ligas activas cuya fecha de inicio ya llegó y aún no tienen jornadas.
 */
class AutoGenerateStartedLeagueFixturesCommand
{
    public function __construct(
        private GenerateLeagueFixturesCommand $generateLeagueFixturesCommand,
    ) {}

    public function execute(): void
    {
        try {
            $startedLeagues = Lliga::query()
                ->where('isActive', true)
                ->whereNotNull('dataInici')
                ->where('dataInici', '<=', now())
                ->get();

            foreach ($startedLeagues as $league) {
                if (!$league instanceof Lliga) {
                    continue;
                }

                // Solo intentamos generar si no hay fixtures; si ya existen, el command lanza excepción.
                try {
                    $this->generateLeagueFixturesCommand->execute(new GenerateLeagueFixturesDTO(
                        leagueId: $league->id,
                        force: false,
                    ));
                } catch (\InvalidArgumentException) {
                    // Caso esperado: liga con fixtures ya generados o sin equipos suficientes.
                    continue;
                }
            }
        } catch (\Throwable $e) {
            Log::warning('No s\'han pogut auto-generar els partits de lliga', [
                'error' => $e->getMessage(),
            ]);
        }
    }
}
