import { useState } from 'react'
import { useSearchMerchs } from '@/queries/merch.queries'
import { useUpdateMerch } from '@/mutations/merch.mutations'
import { useMerchState } from '@/hooks/useMerchState'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Plus,
    Eye,
    Pencil,
    Trash2,
    Loader2,
    RefreshCw,
    Package,
    AlertCircle,
    CheckCircle,
    Search,
    X,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react'
import type { Merch } from '@/types/merch'
import { MerchFormDialog } from './MerchFormDialog'

export function MerchTab() {
    const {
        qInput, setQInput,
        marca, setMarca,
        minPrice, setMinPrice,
        maxPrice, setMaxPrice,
        sort, setSort,
        page, limit, setPage, setLimit,
        clearFilters,
        apiParams,
    } = useMerchState()

    const { data: response, isLoading, error, refetch } = useSearchMerchs(apiParams)
    const updateMerchMutation = useUpdateMerch()

    const merchs = response?.data ?? []
    const totalPages = response?.last_page ?? 1
    const total = response?.total ?? 0

    const [formDialogOpen, setFormDialogOpen] = useState(false)
    const [detailDialogOpen, setDetailDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedMerch, setSelectedMerch] = useState<Merch | null>(null)

    const [notification, setNotification] = useState<{
        type: 'success' | 'error'
        message: string
    } | null>(null)

    const hasActiveFilters = !!(
        apiParams.q ||
        apiParams.marca ||
        apiParams.minPrice ||
        apiParams.maxPrice ||
        apiParams.sort !== 'id'
    )

    const openCreate = () => {
        setSelectedMerch(null)
        setFormDialogOpen(true)
    }

    const openEdit = (merch: Merch) => {
        setSelectedMerch(merch)
        setFormDialogOpen(true)
    }

    const openDetail = (merch: Merch) => {
        setSelectedMerch(merch)
        setDetailDialogOpen(true)
    }

    const openDelete = (merch: Merch) => {
        setSelectedMerch(merch)
        setDeleteDialogOpen(true)
    }

    const handleToggleActive = async (merch: Merch) => {
        try {
            await updateMerchMutation.mutateAsync({
                id: merch.id,
                data: { isActive: !merch.isActive },
            })
            setNotification({
                type: 'success',
                message: `Producte ${merch.isActive ? 'desactivat' : 'activat'} correctament`,
            })
            setTimeout(() => setNotification(null), 3000)
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Error al canviar l'estat del producte"
            setNotification({
                type: 'error',
                message: errorMessage,
            })
            console.error('Error toggle isActive merch:', err)
            setTimeout(() => setNotification(null), 5000)
        }
    }

    if (error) {
        return (
            <div className="alert alert-error">
                <p className="font-semibold">Error al carregar productes</p>
                <p className="text-sm mt-1">No s'han pogut carregar les dades dels productes.</p>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    className="mt-3 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reintentar
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {notification && (
                <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${notification.type === 'success'
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
                        }`}
                >
                    {notification.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    ) : (
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    )}
                    <p className="text-sm font-medium">{notification.message}</p>
                </div>
            )}

            <div className="flex flex-col gap-3">
                <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
                        <Input
                            placeholder="Buscar per nom o marca..."
                            value={qInput}
                            onChange={(e) => setQInput(e.target.value)}
                            className="pl-9 bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600 text-warm-900 dark:text-slate-100"
                        />
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refetch()}
                            className="border-warm-300 dark:border-slate-600 text-warm-700 dark:text-warm-300 hover:bg-warm-50 dark:hover:bg-slate-700"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </Button>

                        <Button
                            size="sm"
                            onClick={openCreate}
                            className="bg-warm-600 hover:bg-warm-700 dark:bg-warm-500 dark:hover:bg-warm-600 text-white"
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Nou producte
                        </Button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                    <Select value={marca || 'all'} onValueChange={(v) => setMarca(v === 'all' ? '' : v)}>
                        <SelectTrigger className="w-[160px] bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600 text-warm-900 dark:text-slate-100">
                            <SelectValue placeholder="Totes les marques" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Totes les marques</SelectItem>
                        </SelectContent>
                    </Select>

                    <Input
                        type="number"
                        placeholder="Preu mínim"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-[130px] bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600 text-warm-900 dark:text-slate-100"
                    />

                    <Input
                        type="number"
                        placeholder="Preu màxim"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-[130px] bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600 text-warm-900 dark:text-slate-100"
                    />

                    <Select value={sort} onValueChange={setSort}>
                        <SelectTrigger className="w-[180px] bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600 text-warm-900 dark:text-slate-100">
                            <SelectValue placeholder="Ordenar per..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="id">Per defecte</SelectItem>
                            <SelectItem value="preu_asc">Preu ascendent</SelectItem>
                            <SelectItem value="preu_desc">Preu descendent</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={String(limit)} onValueChange={(v) => setLimit(Number(v))}>
                        <SelectTrigger className="w-[120px] bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600 text-warm-900 dark:text-slate-100">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10 / pàg</SelectItem>
                            <SelectItem value="20">20 / pàg</SelectItem>
                            <SelectItem value="50">50 / pàg</SelectItem>
                        </SelectContent>
                    </Select>

                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="text-warm-600 dark:text-warm-300 hover:bg-warm-100 dark:hover:bg-slate-700"
                        >
                            <X className="w-4 h-4 mr-1" />
                            Netejar filtres
                        </Button>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-48">
                    <div className="text-center">
                        <Loader2 className="w-10 h-10 animate-spin text-warm-600 dark:text-warm-400 mx-auto mb-3" />
                        <p className="text-warm-600 dark:text-warm-300">Carregant productes...</p>
                    </div>
                </div>
            ) : merchs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                    <Package className="w-12 h-12 text-warm-300 dark:text-slate-600 mb-3" />
                    <p className="text-warm-600 dark:text-warm-300 text-lg font-medium">
                        {hasActiveFilters ? "No s'han trobat productes amb eixos filtres" : 'No hi ha productes registrats'}
                    </p>
                    {hasActiveFilters ? (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={clearFilters}
                            className="mt-4 border-warm-300 dark:border-slate-600 text-warm-700 dark:text-warm-300"
                        >
                            Netejar filtres
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            onClick={openCreate}
                            className="mt-4 bg-warm-600 hover:bg-warm-700 dark:bg-warm-500 dark:hover:bg-warm-600 text-white"
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Crear primer producte
                        </Button>
                    )}
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-lg border border-warm-200 dark:border-slate-700">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-warm-100 dark:bg-slate-800 border-b-2 border-warm-200 dark:border-slate-700">
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider">
                                        Producte
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider hidden md:table-cell">
                                        Marca
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider hidden lg:table-cell">
                                        Preu
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider hidden md:table-cell">
                                        Stock
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider">
                                        Estat
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider">
                                        Accions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {merchs.map((merch) => (
                                    <tr
                                        key={merch.id}
                                        className="border-b border-warm-100 dark:border-slate-700 hover:bg-warm-50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-warm-200 dark:bg-slate-600 flex items-center justify-center font-bold text-sm text-warm-700 dark:text-warm-300 shrink-0">
                                                    {merch.nom?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-sm text-warm-900 dark:text-slate-100 truncate">
                                                        {merch.nom}
                                                    </p>
                                                    <p className="text-xs text-warm-500 dark:text-warm-400 md:hidden truncate">
                                                        {merch.marca || '—'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 py-3 text-sm text-warm-700 dark:text-warm-300 hidden md:table-cell">
                                            {merch.marca || '—'}
                                        </td>

                                        <td className="px-4 py-3 text-center text-sm text-warm-700 dark:text-warm-300 hidden lg:table-cell">
                                            {merch.preu != null ? `${merch.preu.toFixed(2)} €` : '—'}
                                        </td>

                                        <td className="px-4 py-3 text-center hidden md:table-cell">
                                            {merch.stock != null ? (
                                                <Badge
                                                    className={
                                                        merch.stock > 10
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                            : merch.stock > 0
                                                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                    }
                                                >
                                                    {merch.stock}
                                                </Badge>
                                            ) : (
                                                <span className="text-warm-400 text-sm">—</span>
                                            )}
                                        </td>

                                        <td className="px-4 py-3 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Switch
                                                    checked={merch.isActive}
                                                    onCheckedChange={() => handleToggleActive(merch)}
                                                    disabled={updateMerchMutation.isPending}
                                                />
                                                <Badge
                                                    className={
                                                        merch.isActive
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                    }
                                                >
                                                    {merch.isActive ? 'Actiu' : 'Inactiu'}
                                                </Badge>
                                            </div>
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openDetail(merch)}
                                                    title="Veure detall"
                                                    className="h-8 w-8 p-0 text-warm-600 dark:text-warm-300 hover:bg-warm-100 dark:hover:bg-slate-700"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openEdit(merch)}
                                                    title="Editar producte"
                                                    className="h-8 w-8 p-0 text-warm-600 dark:text-warm-300 hover:bg-warm-100 dark:hover:bg-slate-700"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openDelete(merch)}
                                                    title="Eliminar producte"
                                                    className="h-8 w-8 p-0 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-3 bg-warm-50 dark:bg-slate-800/50 rounded-lg border border-warm-200 dark:border-slate-700 flex items-center justify-between">
                        <p className="text-sm text-warm-700 dark:text-warm-300">
                            Mostrant{' '}
                            <strong>{merchs.length}</strong>{' '}
                            de <strong>{total}</strong>{' '}
                            producte{total !== 1 ? 's' : ''}
                        </p>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page <= 1}
                                onClick={() => setPage(page - 1)}
                                className="border-warm-300 dark:border-slate-600 text-warm-700 dark:text-warm-300 hover:bg-warm-50 dark:hover:bg-slate-700 disabled:opacity-50"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>

                            <span className="text-sm text-warm-700 dark:text-warm-300 px-2">
                                {page} / {totalPages}
                            </span>

                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page >= totalPages}
                                onClick={() => setPage(page + 1)}
                                className="border-warm-300 dark:border-slate-600 text-warm-700 dark:text-warm-300 hover:bg-warm-50 dark:hover:bg-slate-700 disabled:opacity-50"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </>
            )}

            <MerchFormDialog
                open={formDialogOpen}
                onOpenChange={setFormDialogOpen}
                merch={selectedMerch}
            />
        </div>
    )
}