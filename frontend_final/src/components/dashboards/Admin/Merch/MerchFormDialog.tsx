import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateMerch, useUpdateMerch } from "@/mutations/merch.mutations"
import { getBrands } from "@/services/merch.service"
import type { CreateMerchRequest, Merch, UpdateMerchRequest, Brand } from "@/types/merch"
import React, { useEffect, useState } from "react"

interface MerchFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    merch?: Merch | null
}

export function MerchFormDialog({ open, onOpenChange, merch }: MerchFormDialogProps) {
    const isEditing = !!merch
    const createMutation = useCreateMerch()
    const updateMutation = useUpdateMerch()

    const [form, setForm] = useState({
        nom: '',
        marca: '',
        imageUrl: '',
        preu: '',
        stock: ''
    })

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [brands, setBrands] = useState<Brand[]>([])
    const [loadingBrands, setLoadingBrands] = useState(false)

    useEffect(() => {
        if (open) {
            loadBrands()
        }
    }, [open])

    const loadBrands = async () => {
        try {
            setLoadingBrands(true)
            const data = await getBrands()
            setBrands(data)
        } catch (err) {
            console.error('Error cargando marcas:', err)
        } finally {
            setLoadingBrands(false)
        }
    }

    useEffect(() => {
        if (merch) {
            setForm({
                nom: merch.nom || '',
                marca: merch.marca || '',
                imageUrl: merch.imageUrl || '',
                preu: merch.preu ? String(merch.preu) : '',
                stock: merch.stock ? String(merch.stock) : ''
            })
        } else {
            setForm({
                nom: '',
                marca: '',
                imageUrl: '',
                preu: '',
                stock: ''
            })
        }
        setErrors({})
    }, [merch, open])

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!form.nom) {
            newErrors.nom = 'El nom és obligatori'
        }

        if (!form.marca) {
            newErrors.marca = 'La marca és obligatoria'
        }

        if (!form.preu) {
            newErrors.preu = 'El preu és obligatori'
        } else if (Number(form.preu) < 0) {
            newErrors.preu = 'El preu no pot ser negatiu'
        }

        if (!form.stock) {
            newErrors.stock = 'El stock és obligatori'
        } else if (Number(form.stock) < 0) {
            newErrors.stock = 'El stock no pot ser negatiu'
        } else if (!Number.isInteger(Number(form.stock))) {
            newErrors.stock = 'El stock ha de ser un nombre enter'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()
        if (!validate()) return

        try {
            if (isEditing && merch) {
                const data: UpdateMerchRequest = {}
                if (form.nom !== merch.nom) data.nom = form.nom
                if (form.marca !== merch.marca) data.marca = form.marca
                if (form.imageUrl !== (merch.imageUrl || '')) data.imageUrl = form.imageUrl || undefined
                if (form.preu !== String(merch.preu)) data.preu = Number(form.preu)
                if (form.stock !== String(merch.stock)) data.stock = Number(form.stock)

                await updateMutation.mutateAsync({ id: merch.id, data })
            } else {
                const data: CreateMerchRequest = {
                    nom: form.nom,
                    marca: form.marca,
                    imageUrl: form.imageUrl || undefined,
                    preu: Number(form.preu),
                    stock: Number(form.stock)
                }
                await createMutation.mutateAsync(data)
            }
            onOpenChange(false)
        } catch (err: any) {
            console.error('Error guardant el producte', err)
            setErrors({ general: err?.response?.data?.message || 'Error al guardar el producte' })
        }
    }

    const isPending = createMutation.isPending || updateMutation.isPending

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Editar producte' : 'Crear producte'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Modifica los datos del producto' : 'Agrega un nuevo producto al catálogo'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="nom">Nom</Label>
                        <Input
                            id="nom"
                            value={form.nom}
                            onChange={(e) => setForm({ ...form, nom: e.target.value })}
                            placeholder="Nom del producte"
                            aria-invalid={!!errors.nom}
                        />
                        {errors.nom && <p className="text-sm text-red-500">{errors.nom}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="marca">Marca</Label>
                        <Select value={form.marca} onValueChange={(value) => setForm({ ...form, marca: value })} disabled={loadingBrands}>
                            <SelectTrigger id="marca" aria-invalid={!!errors.marca}>
                                <SelectValue placeholder={loadingBrands ? 'Cargando marcas...' : 'Selecciona una marca'} />
                            </SelectTrigger>
                            {!loadingBrands && brands.length > 0 && (
                                <SelectContent>
                                    {brands.map((brand) => (
                                        <SelectItem key={brand.value} value={brand.value}>
                                            {brand.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            )}
                        </Select>
                        {errors.marca && <p className="text-sm text-red-500">{errors.marca}</p>}
                        {!loadingBrands && brands.length === 0 && (
                            <p className="text-sm text-yellow-600">No hay marcas disponibles. Crea una primera.</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="preu">Preu</Label>
                        <Input
                            id="preu"
                            type="number"
                            step="0.01"
                            value={form.preu}
                            onChange={(e) => setForm({ ...form, preu: e.target.value })}
                            placeholder="Preu del producte"
                            aria-invalid={!!errors.preu}
                        />
                        {errors.preu && <p className="text-sm text-red-500">{errors.preu}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">Imatge (URL, opcional)</Label>
                        <Input
                            id="imageUrl"
                            value={form.imageUrl}
                            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                            placeholder="https://..."
                            aria-invalid={!!errors.imageUrl}
                        />
                        {errors.imageUrl && <p className="text-sm text-red-500">{errors.imageUrl}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="stock">Stock</Label>
                        <Input
                            id="stock"
                            type="number"
                            value={form.stock}
                            onChange={(e) => setForm({ ...form, stock: e.target.value })}
                            placeholder="Stock disponible"
                            aria-invalid={!!errors.stock}
                        />
                        {errors.stock && <p className="text-sm text-red-500">{errors.stock}</p>}
                    </div>

                    {errors.general && <p className="text-sm text-red-500">{errors.general}</p>}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Guardant...' : isEditing ? 'Actualizar' : 'Crear'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}