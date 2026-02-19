import { useEffect, useMemo, useRef, useState } from 'react'
import { useUrlState } from './useUrlState'
import { useDebouncedValue } from './useDebouncedValue'
import type { SearchMerchsParams } from '@/types/merch'

export function useMerchState() {
    const url = useUrlState()

    const q = url.get('q', '')
    const marca = url.get('marca', '')
    const minPrice = url.get('minPrice', '')
    const maxPrice = url.get('maxPrice', '')
    const sort = url.get('sort', 'id')
    const page = Number(url.get('page'))
    const limit = Number(url.get('limit'))

    const [qInput, setQInput] = useState(q)
    const prevSearchRef = useRef(q)
    const debouncedQ = useDebouncedValue(qInput, 300)

    useEffect(() => {
        setQInput(q)
        prevSearchRef.current = q
    }, [q])

    useEffect(() => {
        if (debouncedQ === prevSearchRef.current) return
        prevSearchRef.current = debouncedQ
        url.setMany({ q: debouncedQ, page: 1 }, { replace: true })
    }, [debouncedQ, url])

    const setMarca = (v: string) =>
        url.setMany({ marca: v, page: 1 })

    const setMinPrice = (v: string) =>
        url.setMany({ minPrice: v, page: 1 })

    const setMaxPrice = (v: string) =>
        url.setMany({ maxPrice: v, page: 1 })

    const setSort = (v: string) =>
        url.setMany({ sort: v, page: 1 })

    const clearFilters = () =>
        url.setMany({ q: '', marca: '', minPrice: '', maxPrice: '', sort: 'id', page: 1 })

    const setPage = (p: number) => url.setMany({ page: p })
    const setLimit = (l: number) => url.setMany({ limit: l, page: 1 })

    const apiParams: SearchMerchsParams = useMemo(() => ({
        q: debouncedQ || undefined,
        marca: marca || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sort: (sort as SearchMerchsParams['sort']) || undefined,
        page,
        limit,
    }), [debouncedQ, marca, minPrice, maxPrice, sort, page, limit])

    return {
        qInput, setQInput,
        marca, setMarca,
        minPrice, setMinPrice,
        maxPrice, setMaxPrice,
        sort, setSort,
        page, limit, setPage, setLimit,
        clearFilters,
        apiParams,
    }
}
