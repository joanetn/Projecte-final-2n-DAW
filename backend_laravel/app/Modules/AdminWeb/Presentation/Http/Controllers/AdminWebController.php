<?php

namespace App\Modules\AdminWeb\Presentation\Http\Controllers;

use App\Enums\LeagueCategory;
use App\Modules\AdminWeb\Application\Commands\AutoGenerateStartedLeagueFixturesCommand;
use App\Models\Equip;
use App\Models\EquipUsuari;
use App\Models\Lliga;
use App\Models\Partit;
use App\Models\Usuari;
use App\Models\UsuariRol;
use App\Models\Classificacio;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AdminWebController extends Controller
{
    public function __construct(
        private AutoGenerateStartedLeagueFixturesCommand $autoGenerateStartedLeagueFixturesCommand,
    ) {}

    // ──────────────────────────────────────────────────────────────────────────
    // ESTADÍSTIQUES
    // ──────────────────────────────────────────────────────────────────────────

    public function estadistiques(): JsonResponse
    {
        try {
            $totalUsuaris  = Usuari::count();
            $actius        = Usuari::where('isActive', true)->count();
            $inactius      = $totalUsuaris - $actius;

            $totalEquips   = Equip::count();
            $equipsActius  = Equip::where('isActive', true)->count();

            $totalLligues  = Lliga::count();
            $lliguesActives = Lliga::where('isActive', true)->count();

            $totalPartits     = Partit::count();
            $partitsPendents  = Partit::where('status', 'PENDENT')->count();
            $partitsCompletats = Partit::where('status', 'COMPLETAT')->count();

            // Árbitres = usuarios con rol ARBITRE activo
            $totalArbitres = UsuariRol::where('rol', 'ARBITRE')
                ->where('isActive', true)
                ->distinct('usuariId')
                ->count('usuariId');

            return response()->json([
                'success' => true,
                'data' => [
                    'usuaris'  => ['total' => $totalUsuaris, 'actius' => $actius, 'inactius' => $inactius],
                    'equips'   => ['total' => $totalEquips, 'actius' => $equipsActius],
                    'lligues'  => ['total' => $totalLligues, 'actives' => $lliguesActives],
                    'partits'  => ['total' => $totalPartits, 'pendents' => $partitsPendents, 'completats' => $partitsCompletats],
                    'arbitres' => ['total' => $totalArbitres],
                ],
            ]);
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // USUARIS
    // ──────────────────────────────────────────────────────────────────────────

    public function llistarUsuaris(Request $request): JsonResponse
    {
        try {
            $query = Usuari::with(['rols' => fn($q) => $q->where('isActive', true)]);

            if ($cerca = $request->query('cerca')) {
                $query->where(function ($q) use ($cerca) {
                    $q->where('nom', 'like', "%{$cerca}%")
                        ->orWhere('email', 'like', "%{$cerca}%");
                });
            }

            if ($actiu = $request->query('actiu')) {
                $query->where('isActive', filter_var($actiu, FILTER_VALIDATE_BOOLEAN));
            }

            if ($rol = $request->query('rol')) {
                $query->whereHas('rols', fn($q) => $q->where('rol', $rol)->where('isActive', true));
            }

            $usuaris = $query->orderBy('created_at', 'desc')->paginate(20);

            $data = $usuaris->map(function (Usuari $u) {
                return [
                    'id'         => $u->id,
                    'nom'        => $u->nom,
                    'email'      => $u->email,
                    'telefon'    => $u->telefon,
                    'nivell'     => $u->nivell,
                    'avatar'     => $u->avatar,
                    'isActive'   => $u->isActive,
                    'rols'       => $u->rols->pluck('rol')->toArray(),
                    'created_at' => $u->created_at?->toISOString(),
                ];
            });

            return response()->json([
                'success' => true,
                'data' => [
                    'usuaris' => $data,
                    'total'   => $usuaris->total(),
                ],
            ]);
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    public function toggleUsuariActiu(Request $request, string $usuariId): JsonResponse
    {
        try {
            $usuari = Usuari::find($usuariId);
            if (!$usuari) {
                return $this->notFound('Usuario no encontrado');
            }

            $usuari->isActive = !$usuari->isActive;
            $usuari->save();

            $estat = $usuari->isActive ? 'activado' : 'desactivado';

            return response()->json([
                'success' => true,
                'message' => "Usuario {$estat} correctamente",
                'data'    => ['isActive' => $usuari->isActive],
            ]);
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    public function canviarRolsUsuari(Request $request, string $usuariId): JsonResponse
    {
        try {
            $request->validate([
                'rols'   => 'required|array|min:1',
                'rols.*' => 'string',
            ]);

            $usuari = Usuari::find($usuariId);
            if (!$usuari) {
                return $this->notFound('Usuario no encontrado');
            }

            $nouRols = $request->input('rols');

            DB::transaction(function () use ($usuari, $nouRols) {
                // Desactivar todos los roles actuales
                UsuariRol::where('usuariId', $usuari->id)->update(['isActive' => false]);

                // Activar o crear los nuevos roles
                foreach ($nouRols as $rol) {
                    UsuariRol::updateOrCreate(
                        ['usuariId' => $usuari->id, 'rol' => $rol],
                        ['isActive' => true]
                    );
                }
            });

            return response()->json([
                'success' => true,
                'message' => 'Roles actualizados correctamente',
            ]);
        } catch (ValidationException $e) {
            return $this->validationError($e);
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    public function eliminarUsuari(Request $request, string $usuariId): JsonResponse
    {
        try {
            $usuari = Usuari::find($usuariId);
            if (!$usuari) {
                return $this->notFound('Usuario no encontrado');
            }

            // Verificar que no sea el último ADMIN_WEB
            $adminCount = UsuariRol::where('rol', 'ADMIN_WEB')
                ->where('isActive', true)
                ->distinct('usuariId')
                ->count('usuariId');

            $esAdmin = UsuariRol::where('usuariId', $usuariId)
                ->where('rol', 'ADMIN_WEB')
                ->where('isActive', true)
                ->exists();

            if ($esAdmin && $adminCount <= 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'No puedes eliminar al último administrador del sistema',
                ], 422);
            }

            $usuari->delete();

            return response()->json([
                'success' => true,
                'message' => 'Usuario eliminado correctamente',
            ]);
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // EQUIPS
    // ──────────────────────────────────────────────────────────────────────────

    public function llistarEquips(Request $request): JsonResponse
    {
        try {
            $query = Equip::with('lliga');

            if ($cerca = $request->query('cerca')) {
                $query->where('nom', 'like', "%{$cerca}%");
            }

            if ($lligaId = $request->query('lligaId')) {
                $query->where('lligaId', $lligaId);
            }

            if ($actiu = $request->query('actiu')) {
                $query->where('isActive', filter_var($actiu, FILTER_VALIDATE_BOOLEAN));
            }

            $equips = $query->withCount('equipUsuaris as totalMembres')
                ->orderBy('created_at', 'desc')
                ->get();

            $data = $equips->map(fn(Equip $e) => [
                'id'           => $e->id,
                'nom'          => $e->nom,
                'categoria'    => $e->categoria,
                'isActive'     => $e->isActive,
                'lliga'        => $e->lliga ? ['id' => $e->lliga->id, 'nom' => $e->lliga->nom] : null,
                'totalMembres' => $e->totalMembres ?? 0,
                'created_at'   => $e->created_at?->toISOString(),
            ]);

            return response()->json([
                'success' => true,
                'data' => ['equips' => $data, 'total' => $equips->count()],
            ]);
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    public function crearEquip(Request $request): JsonResponse
    {
        try {
            $categoriaValues = implode(',', LeagueCategory::values());

            $request->validate([
                'nom'      => 'required|string|max:100|unique:equips,nom',
                'categoria' => "nullable|string|in:{$categoriaValues}",
                'lligaId'  => 'nullable|uuid|exists:lligues,id',
            ]);

            $equip = Equip::create([
                'nom'      => $request->input('nom'),
                'categoria' => $request->input('categoria', ''),
                'lligaId'  => $request->input('lligaId'),
                'isActive' => true,
            ]);

            $equip->load('lliga');

            return response()->json([
                'success' => true,
                'message' => 'Equipo creado correctamente',
                'data' => [
                    'id'        => $equip->id,
                    'nom'       => $equip->nom,
                    'categoria' => $equip->categoria,
                    'isActive'  => $equip->isActive,
                    'lliga'     => $equip->lliga ? ['id' => $equip->lliga->id, 'nom' => $equip->lliga->nom] : null,
                ],
            ], 201);
        } catch (ValidationException $e) {
            return $this->validationError($e);
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    public function actualitzarEquip(Request $request, string $equipId): JsonResponse
    {
        try {
            $equip = Equip::find($equipId);
            if (!$equip) {
                return $this->notFound('Equipo no encontrado');
            }

            $categoriaValues = implode(',', LeagueCategory::values());

            $request->validate([
                'nom'      => "nullable|string|max:100|unique:equips,nom,{$equipId}",
                'categoria' => "nullable|string|in:{$categoriaValues}",
                'lligaId'  => 'nullable|uuid|exists:lligues,id',
                'isActive' => 'nullable|boolean',
            ]);

            $equip->fill(array_filter([
                'nom'      => $request->input('nom'),
                'categoria' => $request->input('categoria'),
                'lligaId'  => $request->input('lligaId'),
                'isActive' => $request->has('isActive') ? $request->boolean('isActive') : null,
            ], fn($v) => !is_null($v)));

            $equip->save();

            return response()->json([
                'success' => true,
                'message' => 'Equipo actualizado correctamente',
            ]);
        } catch (ValidationException $e) {
            return $this->validationError($e);
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    public function eliminarEquip(Request $request, string $equipId): JsonResponse
    {
        try {
            $equip = Equip::find($equipId);
            if (!$equip) {
                return $this->notFound('Equipo no encontrado');
            }

            $equip->delete();

            return response()->json([
                'success' => true,
                'message' => 'Equipo eliminado correctamente',
            ]);
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    public function membresEquip(Request $request, string $equipId): JsonResponse
    {
        try {
            $equip = Equip::find($equipId);
            if (!$equip) {
                return $this->notFound('Equipo no encontrado');
            }

            $membres = EquipUsuari::with('usuari')
                ->where('equipId', $equipId)
                ->get()
                ->map(fn(EquipUsuari $eu) => [
                    'id'       => $eu->id,
                    'usuariId' => $eu->usuariId,
                    'nom'      => $eu->usuari?->nom,
                    'email'    => $eu->usuari?->email,
                    'rolEquip' => $eu->rolEquip,
                ]);

            return response()->json([
                'success' => true,
                'data' => ['membres' => $membres],
            ]);
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // LLIGUES
    // ──────────────────────────────────────────────────────────────────────────

    public function llistarLligues(Request $request): JsonResponse
    {
        try {
            $this->autoGenerateStartedLeagueFixturesCommand->execute();

            $query = Lliga::withCount('equips as totalEquips')
                ->withCount('jornadas as totalJornades');

            if ($cerca = $request->query('cerca')) {
                $query->where('nom', 'like', "%{$cerca}%");
            }

            $lligues = $query->orderBy('created_at', 'desc')->get();

            $data = $lligues->map(fn(Lliga $l) => [
                'id'          => $l->id,
                'nom'         => $l->nom,
                'categoria'   => $l->categoria,
                'dataInici'   => $l->dataInici ? Carbon::parse($l->dataInici)->toISOString() : null,
                'isActive'    => $l->isActive,
                'totalEquips' => $l->totalEquips ?? 0,
                'fixturesGenerats' => ($l->totalJornades ?? 0) > 0,
            ]);

            return response()->json([
                'success' => true,
                'data' => ['lligues' => $data, 'total' => $lligues->count()],
            ]);
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    public function crearLliga(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'nom'      => 'required|string|max:100|unique:lligues,nom',
                'categoria' => 'nullable|string|max:50',
            ]);

            $lliga = Lliga::create([
                'nom'       => $request->input('nom'),
                'categoria' => $request->input('categoria', 'General'),
                'dataInici' => now(),
                'isActive'  => true,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Liga creada correctamente',
                'data' => [
                    'id'        => $lliga->id,
                    'nom'       => $lliga->nom,
                    'categoria' => $lliga->categoria,
                    'isActive'  => $lliga->isActive,
                ],
            ], 201);
        } catch (ValidationException $e) {
            return $this->validationError($e);
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    public function actualitzarLliga(Request $request, string $lligaId): JsonResponse
    {
        try {
            $lliga = Lliga::find($lligaId);
            if (!$lliga) {
                return $this->notFound('Liga no encontrada');
            }

            $request->validate([
                'nom'      => "nullable|string|max:100|unique:lligues,nom,{$lligaId}",
                'categoria' => 'nullable|string|max:50',
                'isActive' => 'nullable|boolean',
            ]);

            $updates = array_filter([
                'nom'      => $request->input('nom'),
                'categoria' => $request->input('categoria'),
                'isActive' => $request->has('isActive') ? $request->boolean('isActive') : null,
            ], fn($v) => !is_null($v));

            $lliga->fill($updates)->save();

            return response()->json([
                'success' => true,
                'message' => 'Liga actualizada correctamente',
            ]);
        } catch (ValidationException $e) {
            return $this->validationError($e);
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    public function eliminarLliga(Request $request, string $lligaId): JsonResponse
    {
        try {
            $lliga = Lliga::find($lligaId);
            if (!$lliga) {
                return $this->notFound('Liga no encontrada');
            }

            // Desasociar equipos antes de eliminar
            Equip::where('lligaId', $lligaId)->update(['lligaId' => null]);

            $lliga->delete();

            return response()->json([
                'success' => true,
                'message' => 'Liga eliminada correctamente',
            ]);
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // PARTITS
    // ──────────────────────────────────────────────────────────────────────────

    public function llistarPartits(Request $request): JsonResponse
    {
        try {
            $query = Partit::with(['local', 'visitant', 'arbitre']);

            if ($status = $request->query('status')) {
                $query->where('status', $status);
            }

            if ($cerca = $request->query('cerca')) {
                $query->whereHas('local', fn($q) => $q->where('nom', 'like', "%{$cerca}%"))
                    ->orWhereHas('visitant', fn($q) => $q->where('nom', 'like', "%{$cerca}%"));
            }

            $partits = $query->orderBy('dataHora', 'desc')->paginate(20);

            $data = $partits->map(fn(Partit $p) => [
                'id'           => $p->id,
                'localId'      => $p->localId,
                'localNom'     => $p->local?->nom,
                'visitantId'   => $p->visitantId,
                'visitantNom'  => $p->visitant?->nom,
                'data'         => $p->dataHora?->format('Y-m-d'),
                'hora'         => $p->dataHora?->format('H:i'),
                'ubicacio'     => $p->ubicacio,
                'status'       => $p->status,
                'setsLocal'    => $p->setsLocal ?? 0,
                'setsVisitant' => $p->setsVisitant ?? 0,
                'arbitreId'    => $p->arbitreId,
                'arbitreNom'   => $p->arbitre?->nom,
                'isActive'     => $p->isActive,
            ]);

            return response()->json([
                'success' => true,
                'data' => ['partits' => $data, 'total' => $partits->total()],
            ]);
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    public function crearPartit(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'localId'    => 'required|uuid|exists:equips,id',
                'visitantId' => 'required|uuid|exists:equips,id|different:localId',
                'data'       => 'nullable|date|after_or_equal:today',
                'hora'       => 'nullable|string',
                'ubicacio'   => 'nullable|string|max:200',
                'lligaId'    => 'nullable|uuid|exists:lligues,id',
            ]);

            $dataHora = null;
            if ($request->input('data')) {
                $hora = $request->input('hora', '00:00');
                $dataHora = \Carbon\Carbon::parse($request->input('data') . ' ' . $hora);
            }

            $partit = Partit::create([
                'localId'      => $request->input('localId'),
                'visitantId'   => $request->input('visitantId'),
                'dataHora'     => $dataHora,
                'ubicacio'     => $request->input('ubicacio'),
                'status'       => 'PENDENT',
                'setsLocal'    => 0,
                'setsVisitant' => 0,
                'isActive'     => true,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Partido creado correctamente',
                'data' => ['id' => $partit->id, 'status' => $partit->status],
            ], 201);
        } catch (ValidationException $e) {
            return $this->validationError($e);
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    public function actualitzarPartit(Request $request, string $partitId): JsonResponse
    {
        try {
            $partit = Partit::find($partitId);
            if (!$partit) {
                return $this->notFound('Partido no encontrado');
            }

            $request->validate([
                'status'       => 'nullable|string|in:PENDENT,PROGRAMAT,EN_CURS,COMPLETAT,CANCEL·LAT',
                'setsLocal'    => 'nullable|integer|min:0',
                'setsVisitant' => 'nullable|integer|min:0',
                'data'         => 'nullable|date',
                'hora'         => 'nullable|string',
                'ubicacio'     => 'nullable|string|max:200',
                'isActive'     => 'nullable|boolean',
            ]);

            if ($request->filled('data')) {
                $hora = $request->input('hora', $partit->dataHora?->format('H:i') ?? '00:00');
                $partit->dataHora = \Carbon\Carbon::parse($request->input('data') . ' ' . $hora);
            }

            if ($request->filled('status'))       $partit->status       = $request->input('status');
            if ($request->filled('setsLocal'))     $partit->setsLocal    = $request->integer('setsLocal');
            if ($request->filled('setsVisitant'))  $partit->setsVisitant = $request->integer('setsVisitant');
            if ($request->filled('ubicacio'))      $partit->ubicacio     = $request->input('ubicacio');
            if ($request->has('isActive'))         $partit->isActive     = $request->boolean('isActive');

            $partit->save();

            return response()->json([
                'success' => true,
                'message' => 'Partido actualizado correctamente',
            ]);
        } catch (ValidationException $e) {
            return $this->validationError($e);
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    public function eliminarPartit(Request $request, string $partitId): JsonResponse
    {
        try {
            $partit = Partit::find($partitId);
            if (!$partit) {
                return $this->notFound('Partido no encontrado');
            }

            $partit->delete();

            return response()->json([
                'success' => true,
                'message' => 'Partido eliminado correctamente',
            ]);
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // ÀRBITRES
    // ──────────────────────────────────────────────────────────────────────────

    public function llistarArbitres(): JsonResponse
    {
        try {
            $arbitresIds = UsuariRol::where('rol', 'ARBITRE')
                ->where('isActive', true)
                ->pluck('usuariId');

            $arbitres = Usuari::whereIn('id', $arbitresIds)
                ->where('isActive', true)
                ->get()
                ->map(function (Usuari $u) {
                    $assignats = Partit::where('arbitreId', $u->id)
                        ->where('status', '!=', 'PENDENT')
                        ->count();

                    $pendents = Partit::where('arbitreId', $u->id)
                        ->where('status', 'PENDENT')
                        ->count();

                    return [
                        'id'               => $u->id,
                        'nom'              => $u->nom,
                        'email'            => $u->email,
                        'telefon'          => $u->telefon,
                        'avatar'           => $u->avatar,
                        'partitsAssignats' => $assignats,
                        'partitsPendents'  => $pendents,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => ['arbitres' => $arbitres],
            ]);
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    public function assignarArbitre(Request $request, string $partitId): JsonResponse
    {
        try {
            $partit = Partit::find($partitId);
            if (!$partit) {
                return $this->notFound('Partido no encontrado');
            }

            $request->validate([
                'arbitreId' => 'nullable|uuid|exists:usuaris,id',
            ]);

            $arbitreId = $request->input('arbitreId');

            if ($arbitreId) {
                $esArbitre = UsuariRol::where('usuariId', $arbitreId)
                    ->where('rol', 'ARBITRE')
                    ->where('isActive', true)
                    ->exists();

                if (!$esArbitre) {
                    return response()->json([
                        'success' => false,
                        'message' => 'El usuario no tiene rol de árbitro',
                    ], 422);
                }
            }

            $partit->arbitreId = $arbitreId;
            $partit->save();

            $msg = $arbitreId ? 'Árbitro asignado correctamente' : 'Árbitro desasignado correctamente';

            return response()->json(['success' => true, 'message' => $msg]);
        } catch (ValidationException $e) {
            return $this->validationError($e);
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    public function partitsArbitre(Request $request, string $arbitreId): JsonResponse
    {
        try {
            $arbitre = Usuari::find($arbitreId);
            if (!$arbitre) {
                return $this->notFound('Árbitro no encontrado');
            }

            $partits = Partit::with(['local', 'visitant'])
                ->where('arbitreId', $arbitreId)
                ->orderBy('dataHora', 'desc')
                ->get()
                ->map(fn(Partit $p) => [
                    'id'           => $p->id,
                    'localNom'     => $p->local?->nom,
                    'visitantNom'  => $p->visitant?->nom,
                    'data'         => $p->dataHora?->format('Y-m-d'),
                    'hora'         => $p->dataHora?->format('H:i'),
                    'status'       => $p->status,
                    'setsLocal'    => $p->setsLocal ?? 0,
                    'setsVisitant' => $p->setsVisitant ?? 0,
                ]);

            return response()->json([
                'success' => true,
                'data' => ['partits' => $partits],
            ]);
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // CLASSIFICACIONS
    // ──────────────────────────────────────────────────────────────────────────

    public function classificacions(): JsonResponse
    {
        try {
            $classificacions = Classificacio::with(['lliga', 'equip'])
                ->where('isActive', true)
                ->orderBy('punts', 'desc')
                ->orderBy('partitsGuanyats', 'desc')
                ->get();

            // Agrupar por lliga
            $grouped = $classificacions->groupBy(fn(Classificacio $c) => $c->lligaId);

            $result = [];
            foreach ($grouped as $lligaId => $rows) {
                $result[$lligaId] = $rows->values()->map(fn(Classificacio $c, int $i) => [
                    'posicio'    => $i + 1,
                    'equipId'    => $c->equipId,
                    'nom'        => $c->equip?->nom,
                    'pj'         => $c->partitsJugats,
                    'g'          => $c->partitsGuanyats,
                    'p'          => $c->partitsPerduts,
                    'gf'         => $c->setsGuanyats,
                    'gc'         => $c->setsPerduts,
                    'diff'       => $c->setsGuanyats - $c->setsPerduts,
                    'pts'        => $c->punts,
                    'lligaNom'   => $c->lliga?->nom,
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => ['classificacions' => $result],
            ]);
        } catch (\Exception $e) {
            return $this->serverError($e);
        }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Helpers
    // ──────────────────────────────────────────────────────────────────────────

    private function notFound(string $message): JsonResponse
    {
        return response()->json(['success' => false, 'message' => $message], 404);
    }

    private function validationError(ValidationException $e): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => 'Error de validación',
            'errors'  => $e->errors(),
        ], 422);
    }

    private function serverError(\Exception $e): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => 'Error interno del servidor',
            'error'   => config('app.debug') ? $e->getMessage() : 'Server error',
        ], 500);
    }
}
