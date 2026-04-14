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
                                className="rounded-lg border border-slate-200 dark:border-slate-700 p-3"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3 min-w-0">
                                        {compra.merch?.imageUrl ? (
                                            <img
                                                src={compra.merch.imageUrl}
                                                alt={compra.merch?.nom ?? 'Producte comprat'}
                                                className="w-14 h-14 rounded-md object-cover border border-slate-200 dark:border-slate-700"
                                            />
                                        ) : (
                                            <div className="w-14 h-14 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-xs flex items-center justify-center">
                                                Merch
                                            </div>
                                        )}

                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                                                {compra.merch?.nom ?? 'Producte no disponible'}
                                            </p>
                                            {compra.merch?.marca && (
                                                <p className="text-xs text-slate-500 truncate">Marca: {compra.merch.marca}</p>
                                            )}
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                Quantitat: {compra.quantitat}
                                                {typeof compra.merch?.preu === 'number' && (
                                                    <>
                                                        {' · '}Preu unitari: {Number(compra.merch.preu).toFixed(2)} €
                                                    </>
                                                )}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                {compra.createdAt
                                                    ? new Date(compra.createdAt).toLocaleDateString('ca-ES')
                                                    : 'Data no disponible'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-1 shrink-0">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                            {compra.total.toFixed(2)} €
                                        </p>
                                        <Badge className={compra.pagat ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                            {compra.pagat ? 'Pagada' : 'Pendent'}
                                        </Badge>
                                    </div>
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