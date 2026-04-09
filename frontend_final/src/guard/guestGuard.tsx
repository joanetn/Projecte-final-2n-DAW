import { useAuth } from '@/context/AuthContext'
import { type JSX } from 'react'
import { Navigate } from 'react-router-dom'

interface GuestGuardProps {
    children: JSX.Element
    redirectTo?: string
}

export const GuestGuard = ({ children, redirectTo = '/' }: GuestGuardProps) => {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) return null

    if (isAuthenticated) return <Navigate to={redirectTo} replace />

    return children
}

export default GuestGuard
