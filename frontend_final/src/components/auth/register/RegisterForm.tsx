import { useRegister } from '@/mutations/auth.mutations'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as z from 'zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const registerSchema = z.object({
    nom: z.string().min(5, "El nom té que tindre mínim 5 dígits"),
    email: z.email().nonoptional("El email no és opcional"),
    contrasenya: z.string().min(8, "La contrasenya ha de tindre 1 mayus min, minúscules, números i  múnim 8 caracters"),
    telefon: z.string().max(20, "El teléfon pot tindre un màxim de 20 dígits"),
    dataNaixement: z.string().date().refine(date => new Date(date) <= new Date(), "La data de naixement ha de ser anterior o igual a avui"),
    avatar: z.string().max(500).optional().nullable(),
    dni: z.string().max(20).optional().nullable(),
    deviceId: z.string().max(255),
    deviceType: z.string().max(50).optional().nullable(),
    browser: z.string().max(100).optional().nullable(),
    os: z.string().max(100).optional().nullable(),
})

type RegisterFormValues = z.infer<typeof registerSchema>

const getDeviceType = (): string => {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
    return /Mobi|Android|iPhone|iPad|Windows Phone/i.test(ua) ? 'mobile' : 'desktop'
}

const getBrowser = (): string => {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
    if (/Edg\//.test(ua)) return 'Edge'
    if (/OPR\//.test(ua) || /Opera\//.test(ua)) return 'Opera'
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

const generateDeviceId = (): string => {
    try {
        // @ts-ignore
        if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
            // @ts-ignore
            return crypto.randomUUID()
        }
    } catch (e) {
        // fallback
    }
    return 'id-' + Math.random().toString(36).slice(2)
}

export function RegisterForm() {
    const mutation = useRegister()
    const navigate = useNavigate()
    const { login } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            nom: '',
            email: '',
            contrasenya: '',
            telefon: '',
            dataNaixement: '',
            avatar: '',
            dni: '',
            deviceId: '',
            deviceType: '',
            browser: '',
            os: '',
        }
    })

    const onSubmit = async (values: RegisterFormValues) => {
        setIsLoading(true)
        setError(null)

        const payload: RegisterFormValues = {
            ...values,
            deviceId: values.deviceId || generateDeviceId(),
            deviceType: values.deviceType || getDeviceType(),
            browser: values.browser || getBrowser(),
            os: values.os || getOS(),
        }

        try {
            await mutation.mutateAsync(payload)

            await login(values.email, values.contrasenya)
            navigate('/')
        } catch (err) {
            console.log(err)
            const errorMessage = err instanceof Error ? err.message : 'Error al registrar-se'
            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full space-y-6">
            {error && (
                <div className="flex gap-3 rounded-lg bg-red-50 p-4 border border-red-200 dark:bg-red-950/20 dark:border-red-900/50">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    {/* Nom */}
                    <FormField
                        control={form.control}
                        name="nom"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-700 dark:text-slate-200">
                                    Nombre
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Tu nombre completo"
                                        type="text"
                                        {...field}
                                        disabled={isLoading}
                                        className="border-warm-200 dark:border-warm-900/20"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Email */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-700 dark:text-slate-200">
                                    Email
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="tu@email.com"
                                        type="email"
                                        {...field}
                                        disabled={isLoading}
                                        className="border-warm-200 dark:border-warm-900/20"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Contrasenya */}
                    <FormField
                        control={form.control}
                        name="contrasenya"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-700 dark:text-slate-200">
                                    Contraseña
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="••••••••"
                                        type="password"
                                        {...field}
                                        disabled={isLoading}
                                        className="border-warm-200 dark:border-warm-900/20"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Teléfono */}
                    <FormField
                        control={form.control}
                        name="telefon"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-700 dark:text-slate-200">
                                    Teléfono
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="+34 666 123 456"
                                        type="tel"
                                        {...field}
                                        disabled={isLoading}
                                        className="border-warm-200 dark:border-warm-900/20"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Data de Naixement */}
                    <FormField
                        control={form.control}
                        name="dataNaixement"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-700 dark:text-slate-200">
                                    Fecha de Nacimiento
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="date"
                                        {...field}
                                        disabled={isLoading}
                                        className="border-warm-200 dark:border-warm-900/20"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* DNI */}
                    <FormField
                        control={form.control}
                        name="dni"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-700 dark:text-slate-200">
                                    DNI (Opcional)
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="12345678A"
                                        type="text"
                                        {...field}
                                        value={field.value || ''}
                                        disabled={isLoading}
                                        className="border-warm-200 dark:border-warm-900/20"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Avatar */}
                    <FormField
                        control={form.control}
                        name="avatar"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-700 dark:text-slate-200">
                                    Avatar URL (Opcional)
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="https://ejemplo.com/avatar.jpg"
                                        type="url"
                                        {...field}
                                        value={field.value || ''}
                                        disabled={isLoading}
                                        className="border-warm-200 dark:border-warm-900/20"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* DeviceId */}
                    <FormField
                        control={form.control}
                        name="deviceId"
                        render={({ field }) => (
                            <FormItem hidden>
                                <FormControl>
                                    <Input
                                        type="hidden"
                                        {...field}
                                        disabled={isLoading}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* DeviceType */}
                    <FormField
                        control={form.control}
                        name="deviceType"
                        render={({ field }) => (
                            <FormItem hidden>
                                <FormControl>
                                    <Input
                                        type="hidden"
                                        {...field}
                                        value={field.value || ''}
                                        disabled={isLoading}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Browser */}
                    <FormField
                        control={form.control}
                        name="browser"
                        render={({ field }) => (
                            <FormItem hidden>
                                <FormControl>
                                    <Input
                                        type="hidden"
                                        {...field}
                                        value={field.value || ''}
                                        disabled={isLoading}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* OS */}
                    <FormField
                        control={form.control}
                        name="os"
                        render={({ field }) => (
                            <FormItem hidden>
                                <FormControl>
                                    <Input
                                        type="hidden"
                                        {...field}
                                        value={field.value || ''}
                                        disabled={isLoading}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-warm-600 hover:bg-warm-700 text-white h-10"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creando cuenta...
                            </>
                        ) : (
                            'Crear cuenta'
                        )}
                    </Button>
                </form>
            </Form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        ¿Ya tienes cuenta?
                    </span>
                </div>
            </div>

            <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/login')}
                className="w-full border-warm-200 text-slate-700 hover:bg-warm-50 dark:border-warm-900/20 dark:text-slate-300 dark:hover:bg-warm-950/20"
            >
                Iniciar sesión
            </Button>
        </div>
    )
}