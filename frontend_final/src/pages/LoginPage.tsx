import { LoginForm } from '@/components/auth/login/LoginForm'

export default function LoginPage() {

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-warm-50 to-white dark:from-slate-900 dark:to-slate-950">
            <div className="w-full max-w-md space-y-8">
                {/* Logo y títulos */}
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br from-warm-500 to-warm-600 shadow-lg">
                            <span className="text-3xl font-bold text-white">PP</span>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        Bienvenido a padelplay
                    </h1>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Inicia sesión para continuar
                    </p>
                </div>

                {/* Card del formulario */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 border border-warm-100 dark:border-warm-900/20">
                    <LoginForm />
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-slate-500 dark:text-slate-500">
                    Al iniciar sesión, aceptas nuestros{' '}
                    <button className="font-semibold text-warm-600 hover:text-warm-700 dark:text-warm-400 dark:hover:text-warm-300">
                        términos de servicio
                    </button>
                </p>
            </div>
        </div>
    )
}
