import { useEffect, useRef, useState, type DragEvent } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useGetPartit } from '@/queries/partit.queries'
import { useGetEquipMembres } from '@/queries/club.queries'
import { useCrearAlineacio, useGetAlineacioByPartit } from '@/queries/alineacio.queries'
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
import type { MembreEquip } from '@/types/club'

// ─── Types ────────────────────────────────────────────────────────────────────
type Slot = MembreEquip | null
type DragPayload = { membre: MembreEquip; fromSlotIndex: number | null }

// ─── Helpers ─────────────────────────────────────────────────────────────────
function jugadorStatus(m: MembreEquip): 'ok' | 'sin-segur' | 'lesionat' {
    if (m.lesionat) return 'lesionat'
    if (m.teSegur === false) return 'sin-segur'
    return 'ok'
}

function StatusBadge({ membre }: { membre: MembreEquip }) {
    const s = jugadorStatus(membre)
    if (s === 'sin-segur') return (
        <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 rounded-full px-2 py-0.5 font-medium">
            <Ban className="w-3 h-3" />Sense segur
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

function slotIndexFromPosicio(posicio?: string): number | null {
    const normalized = (posicio ?? '').trim().toLowerCase()

    if (normalized === 'esquerra' || normalized === 'izquierda' || normalized === 'left') {
        return 0
    }

    if (normalized === 'dreta' || normalized === 'derecha' || normalized === 'right') {
        return 1
    }

    return null
}

// ─── Slot Component ───────────────────────────────────────────────────────────
function PlayerSlot({
    slot,
    index,
    isOver,
    onRemove,
    onDragStart,
    onClick,
}: {
    slot: Slot
    index: number
    isOver: boolean
    onRemove: (index: number) => void
    onDragStart: (event: DragEvent, slotIndex: number) => void
    onClick: (index: number) => void
}) {
    return (
        <div
            onClick={() => onClick(index)}
            className={`
                relative w-40 h-32 sm:w-44 sm:h-36 rounded-2xl border-2 transition-all duration-150 flex flex-col items-center justify-center gap-1.5
                ${isOver
                    ? 'border-cyan-400 bg-cyan-50 shadow-xl scale-105'
                    : slot
                        ? 'border-emerald-400 bg-white/95 shadow-lg'
                        : 'border-dashed border-white/60 bg-white/15 backdrop-blur-sm'}
            `}
        >
            {slot ? (
                <>
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-100 to-emerald-100 flex items-center justify-center text-lg font-bold text-cyan-800">
                        {slot.nom?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <p className="text-sm font-semibold text-slate-800 text-center px-2 truncate w-full text-center">
                        {slot.nom ?? 'Jugador sense nom'}
                    </p>
                    <StatusBadge membre={slot} />
                    <div
                        className="text-slate-400 cursor-grab"
                        draggable
                        onDragStart={(event) => onDragStart(event, index)}
                        title="Arrossega per canviar de posició"
                    >
                        <GripVertical className="w-4 h-4" />
                    </div>
                    <button
                        onClick={(event) => {
                            event.stopPropagation()
                            onRemove(index)
                        }}
                        className="absolute top-1.5 right-1.5 text-slate-400 hover:text-red-500 transition-colors"
                        title="Remover"
                    >
                        ×
                    </button>
                </>
            ) : (
                <>
                    <div className="w-10 h-10 rounded-full border-2 border-dashed border-white/70 flex items-center justify-center text-white/70">
                        <Users className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-white/85 text-center px-2 font-medium">
                        Arrossega o toca per assignar
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
    const { data: alineacions, isLoading: loadingAlineacions } = useGetAlineacioByPartit(partitId ?? null)
    const crearAlineacio = useCrearAlineacio(partitId ?? '')

    const [slots, setSlots] = useState<[Slot, Slot]>([null, null])
    const [overSlot, setOverSlot] = useState<number | null>(null)
    const [saved, setSaved] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null)
    const [hasHydratedSlots, setHasHydratedSlots] = useState(false)
    const dragRef = useRef<DragPayload | null>(null)

    const allMembres: MembreEquip[] = membresData?.membres ?? []
    // Available = not already in a slot
    const slottedIds = new Set(slots.filter(Boolean).map((s) => s!.usuariId))
    const available = allMembres.filter((m) => !slottedIds.has(m.usuariId))
    const selectedPlayer = available.find((m) => m.usuariId === selectedPlayerId) ?? null

    const filledCount = slots.filter(Boolean).length
    const canSave = filledCount === 2 && !!equipId && !!partitId && !loadingAlineacions

    useEffect(() => {
        setSlots([null, null])
        setSelectedPlayerId(null)
        setSaved(false)
        setSaveError(null)
        setHasHydratedSlots(false)
    }, [equipId, partitId])

    useEffect(() => {
        if (hasHydratedSlots) return
        if (!equipId || !partitId) {
            setHasHydratedSlots(true)
            return
        }
        if (loadingAlineacions || loadingMembres) return

        const alineacioEquip = (alineacions ?? []).find((alineacio) => alineacio.equipId === equipId)
        if (!alineacioEquip) {
            setHasHydratedSlots(true)
            return
        }

        const membresByUsuariId = new Map(allMembres.map((membre) => [membre.usuariId, membre]))
        const nextSlots: [Slot, Slot] = [null, null]

        for (const jugador of alineacioEquip.jugadors) {
            const membre = membresByUsuariId.get(jugador.usuariId)
            if (!membre) continue

            const slotIndex = slotIndexFromPosicio(jugador.posicio)
            if (slotIndex === null) {
                if (!nextSlots[0]) {
                    nextSlots[0] = membre
                } else if (!nextSlots[1]) {
                    nextSlots[1] = membre
                }
                continue
            }

            nextSlots[slotIndex] = membre
        }

        setSlots(nextSlots)
        setHasHydratedSlots(true)
    }, [
        hasHydratedSlots,
        equipId,
        partitId,
        loadingAlineacions,
        loadingMembres,
        alineacions,
        allMembres,
    ])

    // Drag handlers
    const handleDragStartFromList = (e: DragEvent, membre: MembreEquip) => {
        if (jugadorStatus(membre) === 'sin-segur') {
            e.preventDefault()
            return
        }
        dragRef.current = { membre, fromSlotIndex: null }
        e.dataTransfer.effectAllowed = 'move'
    }

    const handleDragStartFromSlot = (e: DragEvent, slotIndex: number) => {
        const membre = slots[slotIndex]
        if (!membre) {
            e.preventDefault()
            return
        }

        dragRef.current = { membre, fromSlotIndex: slotIndex }
        e.dataTransfer.effectAllowed = 'move'
    }

    const handleDragOver = (e: DragEvent, slotIndex: number) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        setOverSlot(slotIndex)
    }

    const handleDragLeave = () => setOverSlot(null)

    const handleDrop = (e: DragEvent, slotIndex: number) => {
        e.preventDefault()
        setOverSlot(null)
        const payload = dragRef.current
        if (!payload) return
        dragRef.current = null
        const { membre, fromSlotIndex } = payload
        setSaved(false)
        setSaveError(null)

        setSlots((prev) => {
            const next: [Slot, Slot] = [...prev] as [Slot, Slot]

            if (fromSlotIndex !== null) {
                if (fromSlotIndex === slotIndex) {
                    return prev
                }

                const displaced = next[slotIndex]
                next[slotIndex] = membre
                next[fromSlotIndex] = displaced

                return next
            }

            const otherIndex = slotIndex === 0 ? 1 : 0
            if (next[otherIndex]?.usuariId === membre.usuariId) {
                const displaced = next[slotIndex]
                next[slotIndex] = membre
                next[otherIndex] = displaced
            } else {
                next[slotIndex] = membre
            }

            return next
        })

        if (selectedPlayerId === membre.usuariId) {
            setSelectedPlayerId(null)
        }
    }

    const handleRemove = (slotIndex: number) => {
        setSaved(false)
        setSaveError(null)
        setSlots((prev) => {
            const next: [Slot, Slot] = [...prev] as [Slot, Slot]
            next[slotIndex] = null
            return next
        })
    }

    const handleSelectPlayer = (membre: MembreEquip) => {
        if (jugadorStatus(membre) === 'sin-segur') {
            return
        }

        setSelectedPlayerId((prev) => (prev === membre.usuariId ? null : membre.usuariId))
    }

    const placeSelectedPlayerInSlot = (slotIndex: number) => {
        if (!selectedPlayer) return
        setSaved(false)
        setSaveError(null)

        setSlots((prev) => {
            const next: [Slot, Slot] = [...prev] as [Slot, Slot]
            const otherIndex = slotIndex === 0 ? 1 : 0

            if (next[otherIndex]?.usuariId === selectedPlayer.usuariId) {
                const displaced = next[slotIndex]
                next[slotIndex] = selectedPlayer
                next[otherIndex] = displaced
            } else {
                next[slotIndex] = selectedPlayer
            }

            return next
        })

        setSelectedPlayerId(null)
    }

    const handleSave = async () => {
        if (!canSave) return
        setSaveError(null)
        const jugadors = slots
            .map((slot, index) => {
                if (!slot) return null

                return {
                    jugadorId: slot.usuariId,
                    posicio: index === 0 ? 'Esquerra' : 'Dreta',
                }
            })
            .filter((jugador): jugador is { jugadorId: string; posicio: string } => jugador !== null)

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

    if (loadingPartit || (!!equipId && loadingAlineacions)) return (
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
                            <p className="text-xs text-slate-500 mb-2">
                                Arrossega o fes clic en un jugador i després en una posició.
                            </p>
                            {available.map((membre) => {
                                const status = jugadorStatus(membre)
                                const disabled = status === 'sin-segur'
                                const selected = selectedPlayerId === membre.usuariId
                                return (
                                    <div
                                        key={membre.usuariId}
                                        onClick={() => handleSelectPlayer(membre)}
                                        draggable={!disabled}
                                        onDragStart={(e) => handleDragStartFromList(e, membre)}
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
                                            ${selected ? 'ring-2 ring-blue-400 border-blue-400' : ''}
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
                    <h2 className="font-semibold text-slate-800 dark:text-white text-center mb-1 text-lg">
                        🏸 Pista de Pàdel 2vs2
                    </h2>
                    <p className="text-center text-xs text-slate-500 mb-4">Col·loca la teva parella al mateix camp</p>

                    {/* Court visual */}
                    <div
                        className="relative mx-auto rounded-2xl overflow-hidden border-4 border-emerald-950/90 dark:border-emerald-200/70 shadow-xl"
                        style={{
                            width: '100%',
                            maxWidth: 620,
                            height: 360,
                            background: 'linear-gradient(180deg, #0f766e 0%, #0d9488 40%, #10b981 100%)',
                        }}
                    >
                        <div className="absolute inset-0 opacity-25" style={{
                            backgroundImage: 'radial-gradient(circle at 25% 20%, rgba(255,255,255,0.55) 0, rgba(255,255,255,0) 35%), radial-gradient(circle at 75% 85%, rgba(255,255,255,0.4) 0, rgba(255,255,255,0) 45%)',
                        }} />

                        {/* Court lines */}
                        <div className="absolute inset-0 flex flex-col">
                            <div className="absolute inset-3 border-2 border-white/70 rounded-xl" />
                            <div className="absolute top-10 left-3 right-3 h-0.5 bg-white/70" />
                            <div className="absolute bottom-10 left-3 right-3 h-0.5 bg-white/70" />
                            <div className="absolute top-10 bottom-10 left-1/2 w-0.5 -ml-px bg-white/65" />
                            {/* Net */}
                            <div className="absolute top-1/2 left-3 right-3 -my-1 h-2 bg-white/90 rounded-full" />
                            {/* Net posts */}
                            <div className="absolute top-1/2 left-3 w-2 h-10 -mt-5 bg-white/55 rounded" />
                            <div className="absolute top-1/2 right-3 w-2 h-10 -mt-5 bg-white/55 rounded" />
                            {/* Center T line */}
                            <div className="absolute top-10 bottom-10 left-1/2 w-0.5 bg-white/40" />
                        </div>

                        {/* NET label */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                            <span className="text-[11px] font-bold text-slate-700 bg-white/90 rounded px-2 py-0.5">RED</span>
                        </div>

                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
                            <span className="text-[11px] font-semibold text-white bg-emerald-900/55 rounded-full px-3 py-1">CAMP DEL TEU EQUIP</span>
                        </div>

                        {/* Slot 1 (left side) */}
                        <div
                            className="absolute"
                            style={{ left: '18%', top: '70%', transform: 'translateY(-50%)' }}
                            onDragOver={(e) => handleDragOver(e, 0)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, 0)}
                        >
                            <PlayerSlot
                                slot={slots[0]}
                                index={0}
                                isOver={overSlot === 0}
                                onRemove={handleRemove}
                                onDragStart={handleDragStartFromSlot}
                                onClick={placeSelectedPlayerInSlot}
                            />
                        </div>

                        {/* Slot 2 (right side) */}
                        <div
                            className="absolute"
                            style={{ right: '18%', top: '70%', transform: 'translateY(-50%)' }}
                            onDragOver={(e) => handleDragOver(e, 1)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, 1)}
                        >
                            <PlayerSlot
                                slot={slots[1]}
                                index={1}
                                isOver={overSlot === 1}
                                onRemove={handleRemove}
                                onDragStart={handleDragStartFromSlot}
                                onClick={placeSelectedPlayerInSlot}
                            />
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
