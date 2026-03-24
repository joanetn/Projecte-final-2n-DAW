import { useRegister } from '@/mutations/auth.mutations'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle, Loader2, Users, Trophy, Shield, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const getDeviceType = (): string => {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
    return /Mobi|Android|iPhone|iPad|Windows Phone/i.test(ua) ? 'mobile' : 'desktop'
}
const getBrowser = (): string => {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
    if (/Edg\//.test(ua)) return 'Edge'
    if (/OPR\/|Opera\//.test(ua)) return 'Opera'
    if (/Chrome\//.test(ua) && !/Chromium\//.test(ua)) return 'Chrome'
    if (/Firefox\//.test(ua)) return 'Firefox'
    if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) return 'Safari'
    return 'Unknown'
}
const getOS = (): string => {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
    if (/Windows NT/.test(ua)) return 'Windows'
    if (/Mac OS X/.test(ua)) return 'Mac OS'
    if (/Android/.test(ua)) return 'Android'
    if (/iPhone|iPad|iPod/.test(ua)) return 'iOS'
    return typeof navigator !== 'undefined' && navigator.platform ? navigator.platform : 'Unknown'
}

const getPasswordStrength = (password: string): { level: number; label: string; color: string } => {
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    if (score <= 1) return { level: score, label: 'Débil', color: 'bg-red-500' }
    if (score === 2) return { level: score, label: 'Media', color: 'bg-yellow-500' }
    return { level: score, label: 'Fuerte', color: 'bg-green-500' }
}

const ROLES = [
    {
        id: 'JUGADOR',
        icon: Users,
        title: 'Jugador',
        description: 'Participa en equipos, ve tus estadísticas',
        access: ['Dashboard personal', 'Mis equipos', 'Ver alineaciones', 'Seguro'],
        recommended: true,
    },
    {
        id: 'ENTRENADOR',
        icon: Trophy,
        title: 'Entrenador',
        description: 'Administra tu equipo, crea alineaciones',
        access: ['Dashboard entrenador', 'Gestión de plantilla', 'Crear alineaciones', 'Propuestas de partidos'],
        note: 'Requiere ser admin de un equipo',
    },
    {
        id: 'ARBITRE',
        icon: Shield,
        title: 'Árbitro',
        description: 'Registra actas de partidos oficiales',
        access: ['Dashboard árbitro', 'Crear y editar actas', 'Ver partidos asignados'],
        note: 'Requerirá aprobación de admin',
    },
]

// ─── Step 1: Datos básicos ────────────────────────────────────────────────────
interface Step1Data {
    nom: string
    email: string
    contrasenya: string
    confirmContrasenya: string
    dataNaixement: string
    telefon: string
    avatar: string
    dni: string
    acceptedTerms: boolean
}

function Step1Form({
    data,
    onChange,
    onNext,
}: {
    data: Step1Data
    onChange: (d: Partial<Step1Data>) => void
    onNext: () => void
}) {
    const [errors, setErrors] = useState<Partial<Record<keyof Step1Data, string>>>({})
    const strength = getPasswordStrength(data.contrasenya)

    const calculateAge = (birthDate: string): number => {
        const birth = new Date(birthDate)
        const today = new Date()

        let age = today.getFullYear() - birth.getFullYear()
        const monthDiff = today.getMonth() - birth.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--
        }
        return age
    }

    const validate = () => {
        const e: Partial<Record<keyof Step1Data, string>> = {}

        const name = data.nom.trim()

        if (name.length < 5) e.nom = 'El nombre debe tener al menos 5 caracteres'
        else if (!/^[\p{L}\s]+$/u.test(name)) e.nom = 'El nombre solo puede contener letras y espacios'
        else {
            const words = name.split(/\s+/).filter(Boolean)
            if (words.length < 2) e.nom = 'El nombre debe incluir al menos nombre y apellido'
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Email inválido'
        if (data.contrasenya.length < 8) e.contrasenya = 'La contraseña debe tener al menos 8 caracteres'
        else if (!/[A-Z]/.test(data.contrasenya)) e.contrasenya = 'La contraseña debe incluir una mayúscula'
        else if (!/[a-z]/.test(data.contrasenya)) e.contrasenya = 'La contraseña debe incluir una minúscula'
        else if (!/[0-9]/.test(data.contrasenya)) e.contrasenya = 'La contraseña debe incluir un número'
        if (data.contrasenya !== data.confirmContrasenya) e.confirmContrasenya = 'Las contraseñas no coinciden'

        if (!data.dataNaixement) {
            e.dataNaixement = 'La fecha de nacimiento es obligatoria'
        } else {
            const todayStr = new Date().toISOString().slice(0, 10)
            if (data.dataNaixement > todayStr) {
                e.dataNaixement = 'La fecha de nacimiento no puede ser futura'
            } else {
                const age = calculateAge(data.dataNaixement)
                if (age < 13) e.dataNaixement = 'Debes tener al menos 13 años'
            }
        }

        if (data.telefon.trim()) {
            const digits = data.telefon.replace(/[^\d]/g, '')
            if (digits.length < 9) e.telefon = 'El teléfono debe tener al menos 9 dígitos'
            else if (digits.length > 15) e.telefon = 'El teléfono no puede tener más de 15 dígitos'
        }

        if (data.avatar.trim()) {
            try {
                // eslint-disable-next-line no-new
                new URL(data.avatar)
            } catch {
                e.avatar = 'La URL del avatar no es válida'
            }
        }

        if (data.dni.trim() && data.dni.trim().length > 20) e.dni = 'El DNI no puede tener más de 20 caracteres'

        if (!data.acceptedTerms) e.acceptedTerms = 'Debes aceptar los términos' as any
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleNext = () => {
        if (validate()) onNext()
    }

    return (
        <div className="space-y-4">
            {/* Nombre */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Nombre completo</label>
                <Input
                    placeholder="Tu nombre y apellido"
                    value={data.nom}
                    onChange={(e) => onChange({ nom: e.target.value })}
                    className="border-warm-200 dark:border-warm-900/20"
                />
                {errors.nom && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.nom}</p>}
            </div>

            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Email</label>
                <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={data.email}
                    onChange={(e) => onChange({ email: e.target.value })}
                    className="border-warm-200 dark:border-warm-900/20"
                />
                {errors.email && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email}</p>}
            </div>

            {/* Fecha de nacimiento */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Fecha de nacimiento</label>
                <Input
                    type="date"
                    value={data.dataNaixement}
                    onChange={(e) => onChange({ dataNaixement: e.target.value })}
                    className="border-warm-200 dark:border-warm-900/20"
                />
                {errors.dataNaixement && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.dataNaixement}</p>}
            </div>

            {/* Teléfono (opcional) */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Teléfono (opcional)</label>
                <Input
                    type="tel"
                    placeholder="Ej: 612345678"
                    value={data.telefon}
                    onChange={(e) => onChange({ telefon: e.target.value })}
                    className="border-warm-200 dark:border-warm-900/20"
                />
                {errors.telefon && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.telefon}</p>}
            </div>

            {/* Contraseña */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Contraseña</label>
                <Input
                    type="password"
                    placeholder="••••••••"
                    value={data.contrasenya}
                    onChange={(e) => onChange({ contrasenya: e.target.value })}
                    className="border-warm-200 dark:border-warm-900/20"
                />
                {data.contrasenya && (
                    <div className="mt-2 space-y-1">
                        <div className="flex gap-1 h-1">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className={`flex-1 rounded-full transition-colors ${i <= strength.level ? strength.color : 'bg-slate-200 dark:bg-slate-700'}`}
                                />
                            ))}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Seguridad: <span className="font-medium">{strength.label}</span></p>
                    </div>
                )}
                {errors.contrasenya && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.contrasenya}</p>}
            </div>

            {/* Confirmar contraseña */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Confirmar contraseña</label>
                <Input
                    type="password"
                    placeholder="••••••••"
                    value={data.confirmContrasenya}
                    onChange={(e) => onChange({ confirmContrasenya: e.target.value })}
                    className="border-warm-200 dark:border-warm-900/20"
                />
                {errors.confirmContrasenya && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.confirmContrasenya}</p>
                )}
            </div>

            {/* DNI (opcional) */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">DNI (opcional)</label>
                <Input
                    placeholder="DNI"
                    value={data.dni}
                    onChange={(e) => onChange({ dni: e.target.value })}
                    className="border-warm-200 dark:border-warm-900/20"
                />
                {errors.dni && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.dni}</p>}
            </div>

            {/* Avatar (opcional) */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Avatar (URL, opcional)</label>
                <Input
                    type="url"
                    placeholder="https://..."
                    value={data.avatar}
                    onChange={(e) => onChange({ avatar: e.target.value })}
                    className="border-warm-200 dark:border-warm-900/20"
                />
                {errors.avatar && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.avatar}</p>}
            </div>

            {/* Términos */}
            <div className="flex items-start gap-2">
                <input
                    type="checkbox"
                    id="terms"
                    checked={data.acceptedTerms}
                    onChange={(e) => onChange({ acceptedTerms: e.target.checked })}
                    className="mt-0.5 accent-warm-600"
                />
                <label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                    Acepto los{' '}
                    <span className="text-warm-600 dark:text-warm-400 font-medium">términos de servicio</span>
                    {' '}y la{' '}
                    <span className="text-warm-600 dark:text-warm-400 font-medium">política de privacidad</span>
                </label>
            </div>
            {errors.acceptedTerms && <p className="text-xs text-red-600 dark:text-red-400">{String(errors.acceptedTerms)}</p>}

            <Button
                type="button"
                onClick={handleNext}
                className="w-full bg-warm-600 hover:bg-warm-700 text-white h-10"
            >
                Siguiente
                <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
        </div>
    )
}

// ─── Step 2: Selecció de Rols ─────────────────────────────────────────────────
function Step2Form({
    selectedRoles,
    onToggleRole,
    onBack,
    onSubmit,
    isLoading,
}: {
    selectedRoles: string[]
    onToggleRole: (roleId: string) => void
    onBack: () => void
    onSubmit: () => void
    isLoading: boolean
}) {
    const [error, setError] = useState('')

    const handleSubmit = () => {
        if (selectedRoles.length === 0) {
            setError('Debes seleccionar al menos un rol')
            return
        }
        setError('')
        onSubmit()
    }

    return (
        <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
                ¿Qué harás en la plataforma? Puedes cambiar esto después.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
                Si eliges <span className="font-semibold">Árbitro</span>, se desactivan el resto de roles automáticamente.
            </p>

            <div className="space-y-3">
                {ROLES.map((role) => {
                    const Icon = role.icon
                    const isSelected = selectedRoles.includes(role.id)
                    return (
                        <button
                            key={role.id}
                            type="button"
                            onClick={() => onToggleRole(role.id)}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all relative ${isSelected
                                ? 'border-warm-500 bg-warm-50 dark:border-warm-400 dark:bg-warm-900/20'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-warm-300 dark:hover:border-warm-600'
                                }`}
                        >
                            {isSelected && (
                                <span className="absolute top-3 right-3 w-5 h-5 bg-warm-500 dark:bg-warm-400 rounded-full flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" />
                                </span>
                            )}
                            <div className="flex items-start gap-3">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-warm-100 dark:bg-warm-900/40' : 'bg-slate-100 dark:bg-slate-700'}`}>
                                    <Icon className={`w-5 h-5 ${isSelected ? 'text-warm-600 dark:text-warm-400' : 'text-slate-500 dark:text-slate-400'}`} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-sm text-slate-900 dark:text-white">{role.title}</p>
                                        {role.recommended && (
                                            <span className="text-xs bg-warm-100 text-warm-700 dark:bg-warm-900/30 dark:text-warm-400 px-1.5 py-0.5 rounded-full">
                                                Recomendado
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{role.description}</p>
                                    {role.note && (
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 italic">{role.note}</p>
                                    )}
                                    <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                                        {role.access.map((a) => (
                                            <li key={a} className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                <span className="text-warm-500">✓</span> {a}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </button>
                    )
                })}
            </div>

            {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}

            <div className="flex gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    className="flex-1 border-warm-200 dark:border-slate-600"
                    disabled={isLoading}
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Atrás
                </Button>
                <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex-1 bg-warm-600 hover:bg-warm-700 text-white"
                >
                    {isLoading ? (
                        <><Loader2 className="w-4 h-4 mr-1 animate-spin" />Creando...</>
                    ) : (
                        'Crear cuenta'
                    )}
                </Button>
            </div>
        </div>
    )
}

// ─── RegisterForm (main) ──────────────────────────────────────────────────────
export function RegisterForm() {
    const mutation = useRegister()
    const navigate = useNavigate()
    const { login, deviceId } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [step, setStep] = useState(1)

    const [step1Data, setStep1Data] = useState<Step1Data>({
        nom: '',
        email: '',
        contrasenya: '',
        confirmContrasenya: '',
        dataNaixement: '',
        telefon: '',
        avatar: '',
        dni: '',
        acceptedTerms: false,
    })
    const [selectedRoles, setSelectedRoles] = useState<string[]>(['JUGADOR'])

    const toggleRole = (roleId: string) => {
        setSelectedRoles((prev) => {
            const isAlreadySelected = prev.includes(roleId)

            if (roleId === 'ARBITRE') {
                return isAlreadySelected ? [] : ['ARBITRE']
            }

            const rolesWithoutReferee = prev.filter((r) => r !== 'ARBITRE')

            if (isAlreadySelected) {
                return rolesWithoutReferee.filter((r) => r !== roleId)
            }

            return [...rolesWithoutReferee, roleId]
        })
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        setError(null)
        try {
            await mutation.mutateAsync({
                nom: step1Data.nom,
                email: step1Data.email,
                contrasenya: step1Data.contrasenya,
                deviceId,
                dataNaixement: step1Data.dataNaixement,
                telefon: step1Data.telefon.trim() ? step1Data.telefon.trim() : null,
                avatar: step1Data.avatar.trim() ? step1Data.avatar.trim() : null,
                dni: step1Data.dni.trim() ? step1Data.dni.trim() : null,
                deviceType: getDeviceType(),
                browser: getBrowser(),
                os: getOS(),
                rols: selectedRoles,
            })
            await login(step1Data.email, step1Data.contrasenya)
            navigate('/')
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Error al registrarse'
            setError(msg)
            setStep(1)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full space-y-6">
            {/* Progress */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 flex-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-warm-600 text-white' : 'bg-slate-200 text-slate-500'}`}>1</div>
                    <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-warm-600' : 'bg-slate-200 dark:bg-slate-700'}`} />
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-warm-600 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-700'}`}>2</div>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0">Paso {step} de 2</span>
            </div>

            {error && (
                <div className="flex gap-3 rounded-lg bg-red-50 p-4 border border-red-200 dark:bg-red-950/20 dark:border-red-900/50">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
            )}

            {step === 1 ? (
                <Step1Form
                    data={step1Data}
                    onChange={(d) => setStep1Data((prev) => ({ ...prev, ...d }))}
                    onNext={() => setStep(2)}
                />
            ) : (
                <Step2Form
                    selectedRoles={selectedRoles}
                    onToggleRole={toggleRole}
                    onBack={() => setStep(1)}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                />
            )}
        </div>
    )
}