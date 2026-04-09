import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Loader2 } from 'lucide-react'

/**
 * Ruta de compatibilidad para /home.
 *
 * Redirige al Home unificado para que todos los perfiles
 * entren primero en la portada autenticada y desde allí
 * accedan a su apartado por rol.
 */
export const RoleBasedHome = () => {
    const navigate = useNavigate()
    const { isLoading } = useAuth()

    useEffect(() => {
        if (isLoading) return
        navigate('/', { replace: true })
    }, [isLoading, navigate])

    // Mostrar loading mientras se determina el rol
    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
            <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-300">Redirigiendo...</p>
            </div>
        </div>
    )
}

export default RoleBasedHome
