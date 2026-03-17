import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Loader2, Shield, CheckCircle2, Clock, XCircle } from 'lucide-react'

import { useAuth } from '@/context/AuthContext'
import { useCreatePaymentIntent } from '@/mutations/insurance.mutations'
import { useGetInsurances } from '@/queries/insurance.queries'
import type { Insurance } from '@/types/insurance'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

const stripePublicKey =
    import.meta.env.VITE_STRIPE_PUBLIC_KEY ||
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    ''

const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null
const MONTH_OPTIONS = [1, 3, 6, 12]

const formatDate = (value?: string | null) => {
    if (!value) return '—'
    const normalized = value.includes(' ') ? value.replace(' ', 'T') : value
    const date = new Date(normalized)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleDateString('ca-ES')
}

interface InsuranceCheckoutFormProps {
    onSuccess: (status: string) => Promise<void> | void
    onCancel: () => void
}

function InsuranceCheckoutForm({ onSuccess, onCancel }: InsuranceCheckoutFormProps) {
    const stripe = useStripe()
    const elements = useElements()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const handleConfirmPayment = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setErrorMessage(null)

        if (!stripe || !elements) {
            setErrorMessage('Stripe encara s\'està inicialitzant. Torna-ho a provar en uns segons.')
            return
        }

        setIsSubmitting(true)
        try {
            const result = await stripe.confirmPayment({
                elements,
                redirect: 'if_required',
            })

            if (result.error) {
                setErrorMessage(result.error.message ?? 'No s\'ha pogut completar el pagament.')
                return
            }

            if (result.paymentIntent) {
                await onSuccess(result.paymentIntent.status)
                return
            }

            setErrorMessage('No s\'ha pogut confirmar el pagament.')
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Error confirmant el pagament.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleConfirmPayment} className="space-y-4">
            <PaymentElement />

            {errorMessage && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/20 dark:text-red-300">
                    {errorMessage}
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
                    Cancel·lar
                </Button>
                <Button
                    type="submit"
                    className="flex-1 bg-warm-600 hover:bg-warm-700 text-white"
                    disabled={isSubmitting || !stripe || !elements}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processant pagament...
                        </>
                    ) : (
                        'Pagar ara'
                    )}
                </Button>
            </div>
        </form>
    )
}

export function InsurancesTab() {
    const navigate = useNavigate()
    const { user } = useAuth()

    const { data: insurances = [], isLoading, refetch } = useGetInsurances()
    const createPaymentIntent = useCreatePaymentIntent()

    const [mesos, setMesos] = useState('12')
    const [clientSecret, setClientSecret] = useState<string | null>(null)
    const [pendingInsuranceId, setPendingInsuranceId] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const selectedMonths = Number(mesos) || 12
    const estimatedPrice = (selectedMonths * 10).toFixed(2)

    const myInsurances = useMemo(() => {
        if (!user) return []
        return (insurances as Insurance[]).filter((insurance) => insurance.usuariId === user.id)
    }, [insurances, user])

    const latestInsurance = myInsurances[0]

    const handleCreatePaymentIntent = async () => {
        setErrorMessage(null)
        setSuccessMessage(null)

        if (!user) {
            navigate('/login')
            return
        }

        if (!stripePromise) {
            setErrorMessage('Falta configurar VITE_STRIPE_PUBLIC_KEY al frontend per poder pagar amb Stripe.')
            return
        }

        try {
            const result = await createPaymentIntent.mutateAsync({
                mesos: selectedMonths,
            })

            setClientSecret(result.clientSecret)
            setPendingInsuranceId(result.insuranceId)
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : 'No s\'ha pogut iniciar el pagament del segur.'
            )
        }
    }

    const handlePaymentSuccess = async (status: string) => {
        setClientSecret(null)
        setPendingInsuranceId(null)
        setErrorMessage(null)

        if (status === 'succeeded') {
            setSuccessMessage('Pagament realitzat. Estem confirmant el segur via webhook de Stripe.')
        } else {
            setSuccessMessage('Pagament processat. Comprovarem l\'estat en uns segons.')
        }

        await refetch()
        window.setTimeout(() => {
            void refetch()
        }, 2000)
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-900 p-6 md:p-10">
                <div className="max-w-3xl mx-auto rounded-xl border border-warm-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 text-center">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Inicia sessió per contractar el segur</h2>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        Necessites estar autenticat per generar el pagament.
                    </p>
                    <Button className="mt-4 bg-warm-600 hover:bg-warm-700 text-white" onClick={() => navigate('/login')}>
                        Anar a login
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 p-6 md:p-10">
            <div className="max-w-3xl mx-auto space-y-6">
                <div>
                    <h1 className="text-4xl font-bold text-warm-900 dark:text-warm-100 mb-2 flex items-center gap-3">
                        <Shield className="w-8 h-8" />
                        Segur del jugador
                    </h1>
                    <p className="text-warm-600 dark:text-warm-300">
                        Contracta i paga el teu segur amb Stripe.
                    </p>
                </div>

                {errorMessage && (
                    <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-950/20 dark:text-red-300">
                        {errorMessage}
                    </div>
                )}

                {successMessage && (
                    <div className="rounded-lg bg-green-50 p-4 text-green-800 dark:bg-green-950/20 dark:text-green-300">
                        {successMessage}
                    </div>
                )}

                <div className="rounded-xl border border-warm-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                        Estat actual del segur
                    </h2>

                    {isLoading ? (
                        <div className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Carregant seguros...
                        </div>
                    ) : latestInsurance ? (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                {latestInsurance.pagat ? (
                                    <>
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                        <span className="font-medium text-green-700 dark:text-green-400">Segur pagat</span>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="w-5 h-5 text-amber-600" />
                                        <span className="font-medium text-amber-700 dark:text-amber-400">Pagament pendent</span>
                                    </>
                                )}
                            </div>

                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Duració: <span className="font-medium">{latestInsurance.mesos ?? 12} mesos</span>
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Preu: <span className="font-medium">{(latestInsurance.preu ?? 0).toFixed(2)} €</span>
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Caducitat: {formatDate(latestInsurance.dataExpiracio)}
                            </p>
                        </div>
                    ) : (
                        <p className="text-slate-600 dark:text-slate-400">
                            Encara no tens cap segur registrat.
                        </p>
                    )}
                </div>

                <div className="rounded-xl border border-warm-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Contractar nou segur
                    </h2>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Duració</p>
                            <Select value={mesos} onValueChange={setMesos}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona mesos" />
                                </SelectTrigger>
                                <SelectContent>
                                    {MONTH_OPTIONS.map((option) => (
                                        <SelectItem key={option} value={String(option)}>
                                            {option} mesos
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Preu estimat</p>
                            <div className="h-10 rounded-md border border-input px-3 flex items-center text-sm font-semibold text-slate-900 dark:text-slate-100">
                                {estimatedPrice} €
                            </div>
                        </div>
                    </div>

                    <Button
                        className="w-full bg-warm-600 hover:bg-warm-700 text-white"
                        onClick={handleCreatePaymentIntent}
                        disabled={createPaymentIntent.isPending}
                    >
                        {createPaymentIntent.isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Preparant pagament...
                            </>
                        ) : (
                            'Continuar amb Stripe'
                        )}
                    </Button>

                    {pendingInsuranceId && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Operació en curs: {pendingInsuranceId}
                        </p>
                    )}

                    {!stripePromise && (
                        <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950/20 dark:text-amber-300">
                            Configura VITE_STRIPE_PUBLIC_KEY al teu .env del frontend per activar el pagament.
                        </div>
                    )}

                    {clientSecret && stripePromise && (
                        <div className="rounded-lg border border-warm-100 dark:border-slate-700 p-4">
                            <Elements
                                stripe={stripePromise}
                                options={{
                                    clientSecret,
                                }}
                            >
                                <InsuranceCheckoutForm
                                    onSuccess={handlePaymentSuccess}
                                    onCancel={() => {
                                        setClientSecret(null)
                                        setPendingInsuranceId(null)
                                    }}
                                />
                            </Elements>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}