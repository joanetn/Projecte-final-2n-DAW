import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Trash2, Loader2, Shirt } from 'lucide-react'

import { useAuth } from '@/context/AuthContext'
import { useGetMyCart } from '@/queries/cart.queries'
import {
    useClearCart,
    useConfirmCartCheckoutSession,
    useCreateCartCheckoutSession,
    useRemoveCartItem,
    useUpdateCartItemQuantity,
} from '@/mutations/cart.mutations'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function CartPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { user } = useAuth()

    const { data: cart, isLoading: cartLoading, error: cartError } = useGetMyCart(!!user)
    const removeItemMutation = useRemoveCartItem()
    const updateQuantityMutation = useUpdateCartItemQuantity()
    const clearCartMutation = useClearCart()
    const createCheckoutSessionMutation = useCreateCartCheckoutSession()
    const confirmCheckoutSessionMutation = useConfirmCartCheckoutSession()

    const [isCheckingOut, setIsCheckingOut] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const items = cart?.items ?? []
    const total = cart?.totalAmount ?? 0
    const checkoutStatus = searchParams.get('checkout')
    const checkoutSessionId = searchParams.get('session_id')
    const confirmedSessionRef = useRef<string | null>(null)

    useEffect(() => {
        if (checkoutStatus !== 'success' || !checkoutSessionId || !user) return
        if (confirmedSessionRef.current === checkoutSessionId) return

        confirmedSessionRef.current = checkoutSessionId
        setError(null)

        void confirmCheckoutSessionMutation
            .mutateAsync({ sessionId: checkoutSessionId })
            .catch((e) => {
                const msg = e instanceof Error ? e.message : 'No s\'ha pogut confirmar la compra amb Stripe'
                setError(msg)
            })
    }, [checkoutStatus, checkoutSessionId, user, confirmCheckoutSessionMutation])

    const handleQuantityChange = async (itemId: string, nextValue: number) => {
        if (!Number.isFinite(nextValue) || nextValue < 1) return

        await updateQuantityMutation.mutateAsync({
            itemId,
            payload: { quantitat: Math.floor(nextValue) },
        })
    }

    const handleRemoveItem = async (itemId: string) => {
        await removeItemMutation.mutateAsync(itemId)
    }

    const handleClearCart = async () => {
        await clearCartMutation.mutateAsync()
    }

    const handleCheckout = async () => {
        setError(null)

        if (!user) {
            navigate('/login')
            return
        }

        if (items.length === 0) return

        setIsCheckingOut(true)
        try {
            const baseUrl = window.location.origin

            const checkoutSession = await createCheckoutSessionMutation.mutateAsync({
                successUrl: `${baseUrl}/carrito?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
                cancelUrl: `${baseUrl}/carrito?checkout=cancel`,
            })

            if (!checkoutSession.checkoutUrl) {
                throw new Error('Stripe no ha devuelto URL de checkout')
            }

            window.location.assign(checkoutSession.checkoutUrl)
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Error al finalizar la compra'
            setError(msg)
        } finally {
            setIsCheckingOut(false)
        }
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 p-6 md:p-10">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-warm-900 dark:text-warm-100 mb-2">
                            Carrito
                        </h1>
                        <p className="text-warm-600 dark:text-warm-300">
                            Revisa tu pedido antes de finalizar
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => navigate('/shop')}>
                        Seguir comprando
                    </Button>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-950/20 dark:text-red-300">
                        {error}
                    </div>
                )}

                {cartError && (
                    <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-950/20 dark:text-red-300">
                        Error cargando carrito
                    </div>
                )}

                {checkoutStatus === 'success' && (
                    <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-800 dark:bg-green-950/20 dark:text-green-300">
                        {confirmCheckoutSessionMutation.isPending
                            ? 'Pago completado. Confirmando compra...'
                            : 'Pago completado. Estamos actualizando tu carrito y tus compras.'}
                    </div>
                )}

                {checkoutStatus === 'cancel' && (
                    <div className="mb-6 rounded-lg bg-amber-50 p-4 text-amber-800 dark:bg-amber-950/20 dark:text-amber-300">
                        Has cancelado el pago. Tu carrito se mantiene intacto.
                    </div>
                )}

                {cartLoading ? (
                    <div className="rounded-xl border border-warm-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 text-center">
                        <div className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Cargando carrito...
                        </div>
                    </div>
                ) : items.length === 0 ? (
                    <div className="rounded-xl border border-warm-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 text-center">
                        <p className="text-slate-600 dark:text-slate-400">Tu carrito está vacío.</p>
                        <Button
                            className="mt-4 bg-warm-600 hover:bg-warm-700 text-white"
                            onClick={() => navigate('/shop')}
                        >
                            Ir a la tienda
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="rounded-xl border border-warm-100 dark:border-slate-700 bg-white dark:bg-slate-800">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b last:border-b-0 border-slate-100 dark:border-slate-700"
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        {item.merch?.imageUrl ? (
                                            <img
                                                src={item.merch.imageUrl}
                                                alt={item.merch?.nom ?? 'Merch'}
                                                className="w-14 h-14 rounded-md object-cover border border-warm-100 dark:border-slate-700"
                                            />
                                        ) : (
                                            <div className="w-14 h-14 rounded-md border border-warm-100 dark:border-slate-700 bg-warm-50 dark:bg-slate-700/50 flex items-center justify-center text-warm-500 dark:text-warm-300">
                                                <Shirt className="w-5 h-5" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-900 dark:text-white">
                                                {item.merch?.nom ?? item.merchId}
                                            </p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                {item.merch?.marca ?? 'Sin marca'}
                                            </p>
                                            <p className="text-sm font-semibold text-warm-700 dark:text-warm-300 mt-2">
                                                {(item.merch?.preu ?? 0).toFixed(2)} €
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Input
                                            type="number"
                                            min={1}
                                            value={item.quantitat}
                                            onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                                            className="w-24"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
                                            aria-label="Eliminar"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-xl border border-warm-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Total</span>
                            <span className="text-lg font-bold text-slate-900 dark:text-white">
                                {total.toFixed(2)} €
                            </span>
                        </div>

                        {!user && (
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                Inicia sesión para finalizar la compra.
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                variant="outline"
                                onClick={handleClearCart}
                                disabled={isCheckingOut || clearCartMutation.isPending || createCheckoutSessionMutation.isPending || confirmCheckoutSessionMutation.isPending}
                                className="flex-1"
                            >
                                Vaciar carrito
                            </Button>
                            <Button
                                onClick={handleCheckout}
                                disabled={isCheckingOut || items.length === 0 || createCheckoutSessionMutation.isPending || confirmCheckoutSessionMutation.isPending}
                                className="flex-1 bg-warm-600 hover:bg-warm-700 text-white"
                            >
                                {isCheckingOut || createCheckoutSessionMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Redirigiendo a Stripe...
                                    </>
                                ) : (
                                    'Finalizar compra'
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
