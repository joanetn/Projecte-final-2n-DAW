import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { RegisterForm } from '@/components/auth/register/RegisterForm'

export default function RegisterPage() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-warm-50 to-white dark:from-slate-900 dark:to-slate-950">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br from-warm-500 to-warm-600">
                            <span className="text-3xl font-bold text-white">PP</span>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        Crea tu cuenta
                    </h1>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Únete a PadelPlay hoy
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-8 border border-warm-100 dark:border-warm-900/20 space-y-6">
                    <RegisterForm />
                </div>

                <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                    ¿Ya tienes cuenta?{' '}
                    <button
                        onClick={() => navigate('/login')}
                        className="font-semibold text-warm-600 hover:text-warm-700 dark:text-warm-400 dark:hover:text-warm-300"
                    >
                        Inicia sesión aquí
                    </button>
                </p>
            </div>
        </div>
    )
}
