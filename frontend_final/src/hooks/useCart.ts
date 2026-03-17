import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Merch } from '@/types/merch'

export interface CartItem {
    merch: Pick<Merch, 'id' | 'nom' | 'marca' | 'preu' | 'isActive' | 'stock'>
    quantitat: number
}

const STORAGE_KEY = 'cart'

const safeParse = (raw: string | null): CartItem[] => {
    if (!raw) return []
    try {
        const parsed = JSON.parse(raw) as unknown
        if (!Array.isArray(parsed)) return []
        return parsed
            .map((item) => {
                const anyItem = item as any
                const merch = anyItem?.merch
                const quantitat = Number(anyItem?.quantitat)
                if (!merch?.id || !merch?.nom || !Number.isFinite(quantitat)) return null
                return {
                    merch: {
                        id: String(merch.id),
                        nom: String(merch.nom),
                        marca: merch.marca ? String(merch.marca) : undefined,
                        preu: merch.preu != null ? Number(merch.preu) : undefined,
                        isActive: Boolean(merch.isActive),
                        stock: merch.stock != null ? Number(merch.stock) : undefined,
                    },
                    quantitat: Math.max(1, Math.floor(quantitat)),
                } satisfies CartItem
            })
            .filter(Boolean) as CartItem[]
    } catch {
        return []
    }
}

const readCart = (): CartItem[] => {
    if (typeof window === 'undefined') return []
    return safeParse(localStorage.getItem(STORAGE_KEY))
}

const writeCart = (items: CartItem[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function useCart() {
    const [items, setItems] = useState<CartItem[]>(() => readCart())

    useEffect(() => {
        writeCart(items)
    }, [items])

    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key !== STORAGE_KEY) return
            setItems(readCart())
        }
        window.addEventListener('storage', onStorage)
        return () => window.removeEventListener('storage', onStorage)
    }, [])

    const add = useCallback((merch: Merch, qty = 1) => {
        const quantitatToAdd = Math.max(1, Math.floor(qty))
        setItems((prev) => {
            const idx = prev.findIndex((i) => i.merch.id === merch.id)
            if (idx === -1) {
                return [
                    ...prev,
                    {
                        merch: {
                            id: merch.id,
                            nom: merch.nom,
                            marca: merch.marca,
                            preu: merch.preu,
                            isActive: merch.isActive,
                            stock: merch.stock,
                        },
                        quantitat: quantitatToAdd,
                    },
                ]
            }
            return prev.map((item, i) =>
                i === idx
                    ? { ...item, quantitat: item.quantitat + quantitatToAdd }
                    : item,
            )
        })
    }, [])

    const remove = useCallback((merchId: string) => {
        setItems((prev) => prev.filter((i) => i.merch.id !== merchId))
    }, [])

    const setQuantity = useCallback((merchId: string, qty: number) => {
        const nextQty = Math.max(1, Math.floor(qty))
        setItems((prev) =>
            prev.map((i) => (i.merch.id === merchId ? { ...i, quantitat: nextQty } : i)),
        )
    }, [])

    const clear = useCallback(() => setItems([]), [])

    const count = useMemo(
        () => items.reduce((sum, item) => sum + item.quantitat, 0),
        [items],
    )

    const total = useMemo(
        () =>
            items.reduce(
                (sum, item) => sum + (item.merch.preu ?? 0) * item.quantitat,
                0,
            ),
        [items],
    )

    return {
        items,
        add,
        remove,
        setQuantity,
        clear,
        count,
        total,
    }
}
