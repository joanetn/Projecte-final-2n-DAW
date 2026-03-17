import { useState, useRef } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useGetPartit } from '@/queries/partit.queries'
import { useGetEquipMembres } from '@/queries/club.queries'
import { useCrearAlineacio } from '@/queries/alineacio.queries'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    ArrowLeft,
    GripVertical,
    Ban,
    ShieldCheck,
    AlertTriangle,
    Save,
    Loader2,
    Users,
} from 'lucide-react'
import type { MembreEquip } from '@/services/club.service'

// ─── Types ────────────────────────────────────────────────────────────────────
type Slot = MembreEquip | null

// ─── Helpers ─────────────────────────────────────────────────────────────────
function jugadorStatus(m: MembreEquip): 'ok' | 'sin-segur' | 'lesionat' {
    if (m.lesionat) return 'lesionat'
    if (m.teSeguir === false) return 'sin-segur'
    return 'ok'
}

function StatusBadge({ membre }: { membre: MembreEquip }) {
    const s = jugadorStatus(membre)
    if (s === 'sin-segur') return (
        <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 rounded-full px-2 py-0.5 font-medium">
            <Ban className="w-3 h-3" />Sin segur
        </span>
    )
    if (s === 'lesionat') return (
        <span className="inline-flex items-center gap-1 text-xs bg-orange-100 text-orange-700 rounded-full px-2 py-0.5 font-medium">
            <AlertTriangle className="w-3 h-3" />Lesionat
        </span>
    )
    return (
        <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 rounded-full px-2 py-0.5 font-medium">
            <ShieldCheck className="w-3 h-3" />OK
        </span>
    )
}

// ─── Slot Component ───────────────────────────────────────────────────────────
function PlayerSlot({
    slot,
    index,
    isOver,
    onRemove,
}: {
    slot: Slot
    index: number
    isOver: boolean
    onRemove: (index: number) => void
}) {
    return (
        <div
            className={`
                relative w-44 h-36 rounded-xl border-2 transition-all duration-150 flex flex-col items-center justify-center gap-2
                ${isOver
                    ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                    : slot
                        ? 'border-green-400 bg-white shadow-md'
                        : 'border-dashed border-slate-300 bg-white/60'}
            `}
        >
            {slot ? (
                <>
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-700">
                        {slot.nom?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <p className="text-sm font-semibold text-slate-800 text-center px-2 truncate w-full text-center">
                        {slot.nom ?? `Jugador ${slot.usuariId.slice(0, 4)}`}
                    </p>
                    <StatusBadge membre={slot} />
                    <button
                        onClick={() => onRemove(index)}
                        className="absolute top-1.5 right-1.5 text-slate-400 hover:text-red-500 transition-colors"
                        title="Remover"
                    >
                        ×
                    </button>
                </>
            ) : (
                <>
                    <div className="w-10 h-10 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-300">
                        <Users className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-slate-400 text-center px-2">
                        Arrossega un jugador aquí
                    </p>
                </>
            )}
        </div>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AlineacioPage() {
    const { partitId } = useParams<{ partitId: string }>()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const equipId = searchParams.get('equipId')

    const { data: partit, isLoading: loadingPartit } = useGetPartit(partitId ?? null)
    const { data: membresData, isLoading: loadingMembres } = useGetEquipMembres(equipId)
    const crearAlineacio = useCrearAlineacio(partitId ?? '')

    const [slots, setSlots] = useState<[Slot, Slot]>([null, null])
    const [overSlot, setOverSlot] = useState<number | null>(null)
    const [saved, setSaved] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)
    const dragRef = useRef<MembreEquip | null>(null)

    const allMembres: MembreEquip[] = membresData?.membres ?? []
    // Available = not already in a slot
    const slottedIds = new Set(slots.filter(Boolean).map((s) => s!.usuariId))
    const available = allMembres.filter((m) => !slottedIds.has(m.usuariId))

    const filledCount = slots.filter(Boolean).length
    const canSave = filledCount === 2 && !!equipId && !!partitId

    // Drag handlers
    const handleDragStart = (e: React.DragEvent, membre: MembreEquip) => {
        if (jugadorStatus(membre) === 'sin-segur') {
            e.preventDefault()
            return
        }
        dragRef.current = membre
        e.dataTransfer.effectAllowed = 'move'
    }

    const handleDragOver = (e: React.DragEvent, slotIndex: number) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        setOverSlot(slotIndex)
    }

    const handleDragLeave = () => setOverSlot(null)

    const handleDrop = (e: React.DragEvent, slotIndex: number) => {
        e.preventDefault()
        setOverSlot(null)
        const membre = dragRef.current
        if (!membre) return
        dragRef.current = null

        setSlots((prev) => {
            const next: [Slot, Slot] = [...prev] as [Slot, Slot]
            // If jugador is already in the other slot → swap
            const otherIndex = slotIndex === 0 ? 1 : 0
            if (next[otherIndex]?.usuariId === membre.usuariId) {
                // Swap: put the current slot occupant in the other slot
                const displaced = next[slotIndex]
                next[slotIndex] = membre
                next[otherIndex] = displaced
            } else {
                // Just place in this slot (previous occupant goes back to available)
                next[slotIndex] = membre
            }
            return next
        })
    }

    const handleRemove = (slotIndex: number) => {
        setSlots((prev) => {
            const next: [Slot, Slot] = [...prev] as [Slot, Slot]
            next[slotIndex] = null
            return next
        })
    }

    const handleSave = async () => {
        if (!canSave) return
        setSaveError(null)
        const jugadors = slots.filter(Boolean).map((s, i) => ({
            usuariId: s!.usuariId,
            nom: s!.nom,
            posicio: i === 0 ? 'Esquerra' : 'Dreta',
            titular: true,
            teSeguir: s!.teSeguir ?? true,
            lesionat: s!.lesionat ?? false,
        }))
        try {
            await crearAlineacio.mutateAsync({
                partitId: partitId!,
                equipId: equipId!,
                jugadors,
            })
            setSaved(true)
        } catch {
            setSaveError('Error en guardar. Torna-ho a intentar.')
        }
    }

    if (loadingPartit) return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
    )

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6">
            {/* Header */}
            <div className="mb-6">
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-3 -ml-2">
                    <ArrowLeft className="w-4 h-4 mr-1" />Tornar
                </Button>
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                        🏸 Alineació: {partit?.localNom ?? '—'} vs {partit?.visitantNom ?? '—'}
                    </h1>
                    {partit?.dataHora && (
                        <p className="text-sm text-slate-500 mt-1">
                            {new Date(partit.dataHora).toLocaleDateString('ca-ES', {
                                weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
                            })}
                            {' — '}
                            {new Date(partit.dataHora).toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' })} h
                        </p>
                    )}
                    {partit?.ubicacio && (
                        <p className="text-sm text-slate-400 mt-0.5">📍 {partit.ubicacio}</p>
                    )}
                    <Badge className="mt-2 bg-blue-100 text-blue-700">{partit?.status ?? 'PENDENT'}</Badge>
                </div>
            </div>

            {/* Layout */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left: Available players */}
                <div className="lg:w-72 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                            <Users className="w-4 h-4" />Jugadors Disponibles
                        </h2>
                        <span className="text-xs bg-slate-100 text-slate-600 rounded-full px-2 py-0.5">
                            {available.length} disponibles
                        </span>
                    </div>
                    {available.filter((m) => jugadorStatus(m) === 'sin-segur').length > 0 && (
                        <p className="text-xs text-red-600 mb-2 flex items-center gap-1">
                            <Ban className="w-3 h-3" />
                            {available.filter((m) => jugadorStatus(m) === 'sin-segur').length} sense segur
                        </p>
                    )}
                    {loadingMembres ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                        </div>
                    ) : !equipId ? (
                        <p className="text-sm text-slate-500 text-center py-6">
                            Selecciona un equip des del teu dashboard
                        </p>
                    ) : available.length === 0 ? (
                        <p className="text-sm text-slate-500 text-center py-6">
                            Tots els jugadors ja estan a la pista
                        </p>
                    ) : (
                        <div className="space-y-2 overflow-y-auto max-h-96">
                            {available.map((membre) => {
                                const status = jugadorStatus(membre)
                                const disabled = status === 'sin-segur'
                                return (
                                    <div
                                        key={membre.usuariId}
                                        draggable={!disabled}
                                        onDragStart={(e) => handleDragStart(e, membre)}
                                        title={
                                            disabled ? 'Aquest jugador no té el segur pagat' :
                                                status === 'lesionat' ? `Lesionat${membre.dataLesio ? ` fins ${membre.dataLesio}` : ''}` :
                                                    'Arrossega a la pista'
                                        }
                                        className={`
                                            flex items-center gap-3 p-3 rounded-lg border transition-all
                                            ${disabled
                                                ? 'opacity-60 cursor-not-allowed bg-slate-50 border-slate-200 dark:bg-slate-700 dark:border-slate-600'
                                                : 'cursor-grab active:cursor-grabbing bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm dark:bg-slate-700 dark:border-slate-600'}
                                            ${status === 'lesionat' ? 'border-orange-200 dark:border-orange-700' : ''}
                                        `}
                                    >
                                        <div className={`text-slate-400 ${disabled ? '' : 'cursor-grab'}`}>
                                            {disabled
                                                ? <Ban className="w-4 h-4 text-red-400" />
                                                : <GripVertical className="w-4 h-4" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                                                {membre.nom ?? membre.usuariId}
                                            </p>
                                            {membre.rolEquip && (
                                                <p className="text-xs text-slate-400">{membre.rolEquip}</p>
                                            )}
                                        </div>
                                        <StatusBadge membre={membre} />
                                    </div>
                                )
                            })}
                        </div>
                    )}
                    <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-700">
                        <p className="text-xs text-slate-500 text-center">
                            {filledCount}/2 posicions ocupades
                        </p>
                    </div>
                </div>

                {/* Right: Padel court */}
                <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col">
                    <h2 className="font-semibold text-slate-800 dark:text-white text-center mb-4 text-lg">
                        🏸 Pista de Pàdel 2vs2
                    </h2>

                    {/* Court visual */}
                    <div
                        className="relative mx-auto rounded-xl overflow-hidden border-4 border-slate-800 dark:border-slate-400 shadow-xl"
                        style={{ width: '100%', maxWidth: 520, height: 320, background: 'linear-gradient(to bottom, #2e7d32, #388e3c, #2e7d32)' }}
                    >
                        {/* Court lines */}
                        <div className="absolute inset-0 flex flex-col">
                            {/* Top service line */}
                            <div className="absolute top-8 left-0 right-0 h-0.5 bg-white/60" />
                            {/* Bottom service line */}
                            <div className="absolute bottom-8 left-0 right-0 h-0.5 bg-white/60" />
                            {/* Center divider */}
                            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 -ml-px bg-white/60" />
                            {/* Net */}
                            <div className="absolute top-1/2 left-0 right-0 -my-1 h-2 bg-white/80" />
                            {/* Net posts */}
                            <div className="absolute top-1/2 left-3 w-2 h-10 -mt-5 bg-white/40 rounded" />
                            <div className="absolute top-1/2 right-3 w-2 h-10 -mt-5 bg-white/40 rounded" />
                            {/* Center T line */}
                            <div className="absolute top-8 bottom-8 left-1/2 w-0.5 bg-white/40" />
                        </div>

                        {/* NET label */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                            <span className="text-xs font-bold text-slate-700 bg-white/90 rounded px-2 py-0.5">RED</span>
                        </div>

                        {/* Slot 1 (left side) */}
                        <div
                            className="absolute"
                            style={{ left: '10%', top: '50%', transform: 'translateY(-50%)' }}
                            onDragOver={(e) => handleDragOver(e, 0)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, 0)}
                        >
                            <PlayerSlot slot={slots[0]} index={0} isOver={overSlot === 0} onRemove={handleRemove} />
                        </div>

                        {/* Slot 2 (right side) */}
                        <div
                            className="absolute"
                            style={{ right: '10%', top: '50%', transform: 'translateY(-50%)' }}
                            onDragOver={(e) => handleDragOver(e, 1)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, 1)}
                        >
                            <PlayerSlot slot={slots[1]} index={1} isOver={overSlot === 1} onRemove={handleRemove} />
                        </div>
                    </div>

                    {/* Status + actions */}
                    <div className="mt-6 space-y-3">
                        <div className="flex items-center justify-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full ${filledCount === 2
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-orange-100 text-orange-700'
                                }`}>
                                {filledCount === 2 ? '✅' : '⏳'} Posicions ocupades: {filledCount}/2
                            </span>
                        </div>

                        {saveError && (
                            <p className="text-sm text-red-600 text-center">{saveError}</p>
                        )}

                        {saved ? (
                            <div className="text-center">
                                <span className="text-green-600 font-semibold">✅ Alineació guardada correctament!</span>
                                <div className="mt-3 flex justify-center gap-2">
                                    <Button variant="outline" onClick={() => navigate(-1)}>
                                        <ArrowLeft className="w-4 h-4 mr-1" />Tornar
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-center gap-3">
                                <Button variant="outline" onClick={() => navigate(-1)}>
                                    <ArrowLeft className="w-4 h-4 mr-1" />Tornar
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={!canSave || crearAlineacio.isPending}
                                    className="bg-blue-700 hover:bg-blue-800 text-white disabled:opacity-40"
                                >
                                    {crearAlineacio.isPending ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4 mr-2" />
                                    )}
                                    Guardar Alineació
                                </Button>
                            </div>
                        )}

                        {!equipId && (
                            <p className="text-xs text-center text-orange-600">
                                ⚠️ Cal seleccionar un equip per guardar l'alineació.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
