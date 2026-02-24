import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '@/context/AuthContext'
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

const loginSchema = z.object({
    email: z.string().email('Por favor ingresa un email válido'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const onSubmit = async (values: LoginFormValues) => {
        setIsLoading(true)
        setError(null)

        try {
            await login(values.email, values.password)
            navigate('/')
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión'
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

                    <FormField
                        control={form.control}
                        name="password"
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

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-warm-600 hover:bg-warm-700 text-white h-10"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Iniciando sesión...
                            </>
                        ) : (
                            'Iniciar sesión'
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
                        ¿No tienes cuenta?
                    </span>
                </div>
            </div>

            <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/register')}
                className="w-full border-warm-200 text-slate-700 hover:bg-warm-50 dark:border-warm-900/20 dark:text-slate-300 dark:hover:bg-warm-950/20"
            >
                Crear cuenta
            </Button>
        </div>
    )
}