import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGetPartit, useUpdatePartit } from '@/queries/partit.queries'
import { useGetAlineacioByPartit } from '@/queries/alineacio.queries'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    ArrowLeft,
    Clock,
    Save,
    CheckCircle2,
    Loader2,
    AlertCircle,
    FileText,
} from 'lucide-react'
import { crearPuntuacio } from '@/services/puntuacio.service'
import type { SetResultat } from '@/types/puntuacio'

// ─── Types ────────────────────────────────────────────────────────────────────
type ActaStatus = 'BORRADOR' | 'CONFIRMADA'

interface SetState {
    local: number
    visitant: number
    finalitzat: boolean
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const SET_INITIAL: SetState = { local: 0, visitant: 0, finalitzat: false }

function isSetGuanyat(local: number, visitant: number): boolean {
    if (local >= 6 && visitant <= 4 && local - visitant >= 2) return true
    if (visitant >= 6 && local <= 4 && visitant - local >= 2) return true
    if (local === 7 || visitant === 7) return true // TB or extra
    return false
}

function setWinner(local: number, visitant: number): 'local' | 'visitant' | null {
    if (local > visitant && isSetGuanyat(local, visitant)) return 'local'
    if (visitant > local && isSetGuanyat(local, visitant)) return 'visitant'
    return null
}

function isTieBreak(local: number, visitant: number) {
    return local === 6 && visitant === 6
}

// ─── Set Box ─────────────────────────────────────────────────────────────────
function SetBox({
    set,
    index,
    isActive,
    onSelect,
}: {
    set: SetState
    index: number
    isActive: boolean
    onSelect: () => void
}) {
    const winner = setWinner(set.local, set.visitant)
    const tb = isTieBreak(set.local, set.visitant)
    return (
        <button
            onClick={onSelect}
            className={`
                w-32 h-24 rounded-xl border-2 flex flex-col items-center justify-center transition-all
                ${isActive ? 'border-blue-500 bg-blue-50 shadow-lg scale-105' : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm'}
                ${set.finalitzat ? 'border-green-400 bg-green-50' : ''}
            `}
        >
            <span className="text-xs font-medium text-slate-500 mb-1">Set {index + 1}{tb ? ' (TB)' : ''}</span>
            <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold ${winner === 'local' ? 'text-blue-700' : 'text-slate-700'}`}>
                    {set.local}
                </span>
                <span className="text-slate-400">-</span>
                <span className={`text-2xl font-bold ${winner === 'visitant' ? 'text-orange-600' : 'text-slate-700'}`}>
                    {set.visitant}
                </span>
            </div>
            {set.finalitzat && <span className="text-xs text-green-600 mt-0.5">Finalitzat</span>}
            {!set.finalitzat && isActive && <span className="text-xs text-blue-600 mt-0.5">En joc</span>}
        </button>
    )
}

// ─── Set Editor ───────────────────────────────────────────────────────────────
function SetEditor({
    set,
    index,
    localNom,
    visitantNom,
    onChange,
    onFinish,
}: {
    set: SetState
    index: number
    localNom: string
    visitantNom: string
    onChange: (s: SetState) => void
    onFinish: () => void
}) {
    const tb = isTieBreak(set.local, set.visitant)
    const maxGames = tb ? 99 : 7

    const adjust = (team: 'local' | 'visitant', delta: number) => {
        const newVal = Math.max(0, Math.min(maxGames, set[team] + delta))
        onChange({ ...set, [team]: newVal })
    }

    const canFinish = setWinner(set.local, set.visitant) !== null

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 mt-4">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4 text-center">
                Set {index + 1}{tb ? ' — TIE BREAK (6-6)' : ''} — Marcador de Jocs
            </h3>
            {tb && (
                <p className="text-xs text-center text-slate-500 mb-4">
                    Tie Break: primer a 7 punts (mínim +2 de diferència)
                </p>
            )}
            <div className="grid grid-cols-2 gap-8">
                {/* LOCAL */}
                <div className="flex flex-col items-center gap-3">
                    <p className="text-sm font-semibold text-blue-700 truncate max-w-full text-center">{localNom}</p>
                    <span className="text-5xl font-bold text-blue-700">{set.local}</span>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => adjust('local', -1)} disabled={set.local <= 0} className="w-9 h-9 text-xl">−</Button>
                        <Button size="sm" className="w-9 h-9 text-xl bg-blue-600 hover:bg-blue-700 text-white" onClick={() => adjust('local', 1)} disabled={set.local >= maxGames}>+</Button>
                    </div>
                </div>
                {/* VISITANT */}
                <div className="flex flex-col items-center gap-3">
                    <p className="text-sm font-semibold text-orange-600 truncate max-w-full text-center">{visitantNom}</p>
                    <span className="text-5xl font-bold text-orange-600">{set.visitant}</span>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => adjust('visitant', -1)} disabled={set.visitant <= 0} className="w-9 h-9 text-xl">−</Button>
                        <Button size="sm" className="w-9 h-9 text-xl bg-orange-600 hover:bg-orange-700 text-white" onClick={() => adjust('visitant', 1)} disabled={set.visitant >= maxGames}>+</Button>
                    </div>
                </div>
            </div>
            {canFinish && (
                <div className="mt-5 flex justify-center">
                    <Button onClick={onFinish} className="bg-green-700 hover:bg-green-800 text-white">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Marcar Set com Finalitzat ({setWinner(set.local, set.visitant) === 'local' ? localNom : visitantNom} guanya)
                    </Button>
                </div>
            )}
        </div>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ActaPage() {
    const { partitId } = useParams<{ partitId: string }>()
    const navigate = useNavigate()

    const { data: partit, isLoading: loadingPartit } = useGetPartit(partitId ?? null)
    const { data: alineacions } = useGetAlineacioByPartit(partitId ?? null)
    const updatePartit = useUpdatePartit(partitId ?? '')

    const localNom = partit?.localNom ?? 'Local'
    const visitantNom = partit?.visitantNom ?? 'Visitant'

    const [sets, setSets] = useState<SetState[]>([{ ...SET_INITIAL }])
    const [activeSet, setActiveSet] = useState(0)
    const [observations, setObservations] = useState('')
    const [status, setStatus] = useState<ActaStatus>('BORRADOR')
    const [showConfirm, setShowConfirm] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null)
    const autoSaveRef = useRef<ReturnType<typeof setInterval> | null>(null)

    // Auto-save every 30s (local state snapshot timestamp)
    useEffect(() => {
        autoSaveRef.current = setInterval(() => {
            setLastAutoSave(new Date())
        }, 30000)
        return () => {
            if (autoSaveRef.current) clearInterval(autoSaveRef.current)
        }
    }, [])

    // Calculated results
    const setsLocal = sets.filter((s) => s.finalitzat && setWinner(s.local, s.visitant) === 'local').length
    const setsVisitant = sets.filter((s) => s.finalitzat && setWinner(s.local, s.visitant) === 'visitant').length
    const totalSetsFinished = sets.filter((s) => s.finalitzat).length

    // Get alineació players
    const localAlineacio = (alineacions ?? []).find((a) => a.equipId === partit?.localId)
    const visitantAlineacio = (alineacions ?? []).find((a) => a.equipId === partit?.visitantId)
    const localJugadors = localAlineacio?.jugadors ?? []
    const visitantJugadors = visitantAlineacio?.jugadors ?? []

    const handleSetChange = (index: number, updated: SetState) => {
        setSets((prev) => prev.map((s, i) => i === index ? updated : s))
    }

    const handleFinishSet = (index: number) => {
        setSets((prev) => {
            const next = prev.map((s, i) => i === index ? { ...s, finalitzat: true } : s)
            // Add a new set if not finished match yet
            const localWins = next.filter((s) => s.finalitzat && setWinner(s.local, s.visitant) === 'local').length
            const visitantWins = next.filter((s) => s.finalitzat && setWinner(s.local, s.visitant) === 'visitant').length
            if (localWins < 2 && visitantWins < 2 && next.length < 3) {
                next.push({ ...SET_INITIAL })
                setActiveSet(next.length - 1)
            } else {
                setActiveSet(index) // stay on current
            }
            return next
        })
    }

    const handleConfirm = async () => {
        if (!partitId) return
        setSaving(true)
        setError(null)
        try {
            // Save result sets to puntuacions (one per equip)
            const setsData: SetResultat[] = sets.filter((s) => s.finalitzat).map((s) => ({
                local: s.local,
                visitant: s.visitant,
            }))

            if (partit?.localId) {
                await crearPuntuacio({
                    partitId,
                    equipId: partit.localId,
                    punts: setsLocal,
                    stats: { sets: setsData },
                    observacions: observations,
                })
            }
            if (partit?.visitantId) {
                await crearPuntuacio({
                    partitId,
                    equipId: partit.visitantId,
                    punts: setsVisitant,
                    stats: { sets: setsData },
                    observacions: observations,
                })
            }
            // Update partit status to COMPLETAT
            await updatePartit.mutateAsync({
                status: 'COMPLETAT',
                ...(setsLocal !== undefined && { setsLocal }),
                ...(setsVisitant !== undefined && { setsVisitant }),
            } as Parameters<typeof updatePartit.mutateAsync>[0])

            setStatus('CONFIRMADA')
            setShowConfirm(false)
        } catch {
            setError('Error en confirmar l\'acta. Torna-ho a intentar.')
        } finally {
            setSaving(false)
        }
    }

    if (loadingPartit) return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
    )

    // ─────────────────────────────────────────────────────────────────────────
    // CONFIRMED VIEW
    if (status === 'CONFIRMADA') {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 flex flex-col items-center">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-green-300 shadow-lg p-8 max-w-lg w-full text-center">
                    <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Acta Confirmada</h1>
                    <p className="text-slate-500 mb-6">L'acta ha estat enviada i el partit marcat com a completat.</p>
                    <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 mb-4">
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">
                            <span className="text-blue-700">{localNom}</span>
                            <span className="mx-3 text-slate-400 font-normal text-xl">{setsLocal} — {setsVisitant}</span>
                            <span className="text-orange-600">{visitantNom}</span>
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                            {sets.filter((s) => s.finalitzat).map((s) => `${s.local}-${s.visitant}`).join(', ')}
                        </p>
                    </div>
                    {observations && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 italic mb-4">"{observations}"</p>
                    )}
                    <Button onClick={() => navigate(-1)} className="bg-blue-700 hover:bg-blue-800 text-white">
                        <ArrowLeft className="w-4 h-4 mr-2" />Tornar al Dashboard
                    </Button>
                </div>
            </div>
        )
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CONFIRM SCREEN
    if (showConfirm) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 flex flex-col items-center justify-center">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 shadow-lg p-8 max-w-lg w-full">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Validació de l'Acta
                    </h2>
                    <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                            Sets completats: {totalSetsFinished} ({sets.filter((s) => s.finalitzat).map((s) => `${s.local}-${s.visitant}`).join(', ')})
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                            Resultat final: {localNom} {setsLocal}-{setsVisitant} {visitantNom}
                        </div>
                        {localJugadors.length > 0 && (
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                                <span>Parella Local: {localJugadors.map((j) => j.nom ?? j.usuariId).join(' + ')}</span>
                            </div>
                        )}
                        {visitantJugadors.length > 0 && (
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                                <span>Parella Visitant: {visitantJugadors.map((j) => j.nom ?? j.usuariId).join(' + ')}</span>
                            </div>
                        )}
                        {observations && (
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                                Observacions: {observations.length} caràcters
                            </div>
                        )}
                    </div>
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200">
                        <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                            🟢 Acta llesta per confirmar
                        </p>
                    </div>
                    {error && (
                        <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4" />{error}
                        </div>
                    )}
                    <div className="flex gap-3 mt-6">
                        <Button variant="outline" onClick={() => setShowConfirm(false)} className="flex-1">
                            Tornar a editar
                        </Button>
                        <Button onClick={handleConfirm} disabled={saving} className="flex-1 bg-green-700 hover:bg-green-800 text-white">
                            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                            Confirmar & Enviar Acta
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    // ─────────────────────────────────────────────────────────────────────────
    // MAIN EDITING VIEW
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6">
            {/* Header */}
            <div className="mb-6">
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-3 -ml-2">
                    <ArrowLeft className="w-4 h-4 mr-1" />Tornar
                </Button>

                {/* ATP Scoreboard */}
                <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xl">
                    <div className="flex items-center justify-between mb-2">
                        {partit?.dataHora && (
                            <span className="text-xs text-slate-400 uppercase tracking-widest">
                                {new Date(partit.dataHora).toLocaleDateString('ca-ES', {
                                    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
                                }).toUpperCase()}
                                {' — '}
                                {new Date(partit.dataHora).toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' })} h
                            </span>
                        )}
                        <Badge className="bg-yellow-600 text-white">
                            📝 BORRADOR
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                        <div className="flex-1">
                            <p className="text-lg font-bold text-blue-300 truncate">{localNom}</p>
                            {localJugadors.length > 0 && (
                                <p className="text-xs text-slate-400">{localJugadors.map((j) => j.nom ?? j.usuariId).join(' + ')}</p>
                            )}
                        </div>
                        <div className="text-center px-4">
                            <p className="text-5xl font-bold">
                                <span className="text-blue-400">{setsLocal}</span>
                                <span className="text-slate-500 mx-2 text-3xl">-</span>
                                <span className="text-orange-400">{setsVisitant}</span>
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                                {sets.filter((s) => s.finalitzat).map((s) => `${s.local}-${s.visitant}`).join(', ') || '—'}
                            </p>
                        </div>
                        <div className="flex-1 text-right">
                            <p className="text-lg font-bold text-orange-300 truncate">{visitantNom}</p>
                            {visitantJugadors.length > 0 && (
                                <p className="text-xs text-slate-400">{visitantJugadors.map((j) => j.nom ?? j.usuariId).join(' + ')}</p>
                            )}
                        </div>
                    </div>

                    {partit?.ubicacio && (
                        <p className="text-xs text-slate-400 mt-2 text-center">📍 {partit.ubicacio}</p>
                    )}
                    {lastAutoSave && (
                        <p className="text-xs text-slate-500 mt-1 text-center flex items-center justify-center gap-1">
                            <Clock className="w-3 h-3" />
                            Guardat automàticament: {lastAutoSave.toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    )}
                </div>
            </div>

            {/* Sets row */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-slate-800 dark:text-white">Sets</h2>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                            setSets((prev) => [...prev, { ...SET_INITIAL }])
                            setActiveSet(sets.length)
                        }}
                        disabled={sets.length >= 3}
                        className="text-xs"
                    >
                        + Afegir Set
                    </Button>
                </div>
                <div className="flex flex-wrap gap-3">
                    {sets.map((set, i) => (
                        <SetBox
                            key={i}
                            set={set}
                            index={i}
                            isActive={activeSet === i}
                            onSelect={() => setActiveSet(i)}
                        />
                    ))}
                </div>

                {/* Active set editor */}
                <SetEditor
                    key={activeSet}
                    set={sets[activeSet] ?? SET_INITIAL}
                    index={activeSet}
                    localNom={localNom}
                    visitantNom={visitantNom}
                    onChange={(updated) => handleSetChange(activeSet, updated)}
                    onFinish={() => handleFinishSet(activeSet)}
                />
            </div>

            {/* Players stats (side by side) */}
            {(localJugadors.length > 0 || visitantJugadors.length > 0) && (
                <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Local */}
                    {localJugadors.length > 0 && (
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-blue-100 dark:border-slate-700 p-4">
                            <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-3">Parella Local</h3>
                            <div className="space-y-2">
                                {localJugadors.map((j) => (
                                    <div key={j.usuariId} className="flex items-center justify-between text-sm">
                                        <span className="text-slate-700 dark:text-slate-300 font-medium">{j.nom ?? j.usuariId}</span>
                                        <span className="text-xs text-slate-400">{j.posicio ?? '—'}</span>
                                    </div>
                                ))}
                                <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                                    <p className="text-xs text-slate-500">Jocs guanyats: <span className="font-bold text-blue-700">{setsLocal}</span></p>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Visitant */}
                    {visitantJugadors.length > 0 && (
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-orange-100 dark:border-slate-700 p-4">
                            <h3 className="font-semibold text-orange-600 dark:text-orange-300 mb-3">Parella Visitant</h3>
                            <div className="space-y-2">
                                {visitantJugadors.map((j) => (
                                    <div key={j.usuariId} className="flex items-center justify-between text-sm">
                                        <span className="text-slate-700 dark:text-slate-300 font-medium">{j.nom ?? j.usuariId}</span>
                                        <span className="text-xs text-slate-400">{j.posicio ?? '—'}</span>
                                    </div>
                                ))}
                                <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                                    <p className="text-xs text-slate-500">Jocs guanyats: <span className="font-bold text-orange-600">{setsVisitant}</span></p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Observations */}
            <div className="mb-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                <h3 className="font-semibold text-slate-800 dark:text-white mb-3">Observacions de l'Àrbitre</h3>
                <textarea
                    value={observations}
                    onChange={(e) => setObservations(e.target.value.slice(0, 500))}
                    placeholder="Afegeix observacions del partit (màx. 500 caràcters)..."
                    rows={4}
                    className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-slate-400 mt-1 text-right">{observations.length}/500</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <Button variant="outline" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-4 h-4 mr-1" />Tornar
                </Button>
                <Button
                    variant="outline"
                    onClick={() => setLastAutoSave(new Date())}
                    className="border-slate-300"
                >
                    <Save className="w-4 h-4 mr-2" />Guardar Esborrany
                </Button>
                <Button
                    onClick={() => setShowConfirm(true)}
                    disabled={totalSetsFinished === 0}
                    className="bg-green-700 hover:bg-green-800 text-white disabled:opacity-40"
                >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Confirmar Acta
                </Button>
            </div>
        </div>
    )
}
