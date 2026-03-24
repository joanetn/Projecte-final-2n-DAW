import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Search, Shirt, X } from 'lucide-react'

import { useSearchMerchs, useGetBrands } from '@/queries/merch.queries'
import { useAuth } from '@/context/AuthContext'
import { useAddCartItem } from '@/mutations/cart.mutations'
import { useMerchState } from '@/hooks/useMerchState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

export default function ShopPage() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const addCartItemMutation = useAddCartItem()
    const [cartError, setCartError] = useState<string | null>(null)

    const {
        qInput, setQInput,
        marca, setMarca,
        minPrice, setMinPrice,
        maxPrice, setMaxPrice,
        sort, setSort,
        page, setPage,
        limit, setLimit,
        clearFilters,
        apiParams,
    } = useMerchState()

    const { data: response, isLoading, error } = useSearchMerchs(apiParams)
    const { data: brands = [] } = useGetBrands()

    const merchs = response?.data ?? []
    const totalPages = response?.last_page ?? 1
    const total = response?.total ?? 0
    const currentPage = response?.current_page ?? page

    const hasActiveFilters = !!(
        apiParams.q ||
        apiParams.marca ||
        apiParams.minPrice ||
        apiParams.maxPrice ||
        apiParams.sort !== 'id'
    )

    const handleAddToCart = async (merchId: string) => {
        setCartError(null)

        if (!user) {
            navigate('/login')
            return
        }

        try {
            await addCartItemMutation.mutateAsync({
                merchId,
                quantitat: 1,
            })
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Error añadiendo producto al carrito'
            setCartError(msg)
        }
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-warm-900 dark:text-warm-100 mb-2">
                            Tienda
                        </h1>
                        <p className="text-warm-600 dark:text-warm-300">
                            Merchandising disponible
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => navigate('/carrito')}>
                        Ver carrito
                    </Button>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-950/20 dark:text-red-300">
                        Error cargando productos
                    </div>
                )}

                {cartError && (
                    <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-950/20 dark:text-red-300">
                        {cartError}
                    </div>
                )}

                <div className="mb-6 rounded-xl border border-warm-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        <div className="relative sm:col-span-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
                            <Input
                                placeholder="Buscar por nombre o marca..."
                                value={qInput}
                                onChange={(event) => setQInput(event.target.value)}
                                className="pl-9"
                            />
                        </div>

                        <Select value={marca || 'all'} onValueChange={(value) => setMarca(value === 'all' ? '' : value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Todas las marcas" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas las marcas</SelectItem>
                                {brands.map((brand) => (
                                    <SelectItem key={brand.value} value={brand.value}>
                                        {brand.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Input
                            type="number"
                            min={0}
                            placeholder="Precio mín."
                            value={minPrice}
                            onChange={(event) => setMinPrice(event.target.value)}
                        />

                        <Input
                            type="number"
                            min={0}
                            placeholder="Precio máx."
                            value={maxPrice}
                            onChange={(event) => setMaxPrice(event.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            {total} productes trobats
                        </p>

                        <div className="flex flex-wrap items-center gap-2">
                            <Select value={sort} onValueChange={setSort}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Ordenar por" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="id">Por defecto</SelectItem>
                                    <SelectItem value="preu_asc">Precio ascendente</SelectItem>
                                    <SelectItem value="preu_desc">Precio descendente</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={String(limit)} onValueChange={(value) => setLimit(Number(value))}>
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="20">20 / pág</SelectItem>
                                    <SelectItem value="50">50 / pág</SelectItem>
                                    <SelectItem value="100">100 / pág</SelectItem>
                                </SelectContent>
                            </Select>

                            {hasActiveFilters && (
                                <Button variant="ghost" size="sm" onClick={clearFilters}>
                                    <X className="w-4 h-4 mr-1" />
                                    Limpiar filtros
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, idx) => (
                            <div
                                key={idx}
                                className="rounded-xl border border-warm-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-5"
                            >
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/2 mt-3" />
                                <Skeleton className="h-10 w-full mt-6" />
                            </div>
                        ))}
                    </div>
                ) : merchs.length === 0 ? (
                    <div className="rounded-xl border border-warm-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 text-center">
                        <p className="text-slate-600 dark:text-slate-400">
                            No s'han trobat productes amb aquests filtres.
                        </p>
                        {hasActiveFilters && (
                            <Button className="mt-4" variant="outline" onClick={clearFilters}>
                                Netejar filtres
                            </Button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {merchs.map((m) => {
                                const outOfStock = m.stock != null && m.stock <= 0
                                return (
                                    <div
                                        key={m.id}
                                        className="rounded-xl border border-warm-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 flex flex-col"
                                    >
                                        <div className="mb-4">
                                            {m.imageUrl ? (
                                                <img
                                                    src={m.imageUrl}
                                                    alt={m.nom}
                                                    className="w-full h-40 rounded-lg object-cover border border-warm-100 dark:border-slate-700"
                                                />
                                            ) : (
                                                <div className="w-full h-40 rounded-lg border border-warm-100 dark:border-slate-700 bg-warm-50 dark:bg-slate-700/50 flex items-center justify-center text-warm-500 dark:text-warm-300">
                                                    <Shirt className="w-8 h-8" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-900 dark:text-white">
                                                {m.nom}
                                            </h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                {m.marca ?? 'Sin marca'}
                                            </p>
                                            <div className="mt-3 flex items-center justify-between">
                                                <p className="text-sm font-semibold text-warm-700 dark:text-warm-300">
                                                    {(m.preu ?? 0).toFixed(2)} €
                                                </p>
                                                {m.stock != null && (
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        Stock: {m.stock}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <Button
                                            className="mt-5 w-full bg-warm-600 hover:bg-warm-700 text-white"
                                            disabled={!m.isActive || outOfStock || addCartItemMutation.isPending}
                                            onClick={() => handleAddToCart(m.id)}
                                        >
                                            {outOfStock ? 'Sin stock' : 'Añadir al carrito'}
                                        </Button>
                                    </div>
                                )
                            })}
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-8 flex items-center justify-center gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage <= 1}
                                    onClick={() => setPage(currentPage - 1)}
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Anterior
                                </Button>

                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                    Pàgina {currentPage} de {totalPages}
                                </span>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage >= totalPages}
                                    onClick={() => setPage(currentPage + 1)}
                                >
                                    Següent
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
