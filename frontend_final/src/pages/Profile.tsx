import { Sessions } from "@/components/profile/Sessions"
import { useAuth } from "@/context/AuthContext"
import { useGetComprasByUsuari } from "@/queries/merch.queries"
import { Badge } from "@/components/ui/badge"
import { Loader2, ShoppingBag } from "lucide-react"

const Profile = () => {
    const { user } = useAuth()
    const { data: compras = [], isLoading } = useGetComprasByUsuari(user?.id ?? null)

    const comprasOrdenades = [...compras].sort((a, b) => {
        const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return bDate - aDate
    })

    return (
        <div className="space-y-6">
            <Sessions />

            <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                <div className="flex items-center gap-2 mb-4">
                    <ShoppingBag className="w-5 h-5 text-warm-600 dark:text-warm-300" />
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Les meves compres</h2>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-8 text-slate-500">
                        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Carregant compres...
                    </div>
                ) : comprasOrdenades.length === 0 ? (
                    <p className="text-sm text-slate-500">Encara no tens compres registrades.</p>
                ) : (
                    <div className="space-y-2">
                        {comprasOrdenades.map((compra) => (
                            <div
                                key={compra.id}
                                className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 p-3"
                            >
                                <div>
                                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                        {compra.quantitat}x · {compra.total.toFixed(2)} €
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {compra.createdAt
                                            ? new Date(compra.createdAt).toLocaleDateString('ca-ES')
                                            : 'Data no disponible'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className={compra.pagat ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                        {compra.pagat ? 'Pagada' : 'Pendent'}
                                    </Badge>
                                    {compra.status && <Badge variant="secondary">{compra.status}</Badge>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}

export default Profile