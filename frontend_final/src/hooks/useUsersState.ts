import { useEffect, useMemo, useState, useRef } from 'react'
import { useUrlState } from './useUrlState'
import { useDebouncedValue } from './useDebouncedValue'
import type { SearchUsersParams } from '@/types/users'

export function useUsersState() {
    const url = useUrlState()

    const q = url.get('q', '')
    const nivell = url.get('nivell', '')
    const sort = url.get('sort', 'created_at_desc')
    const page = Number(url.get('page', '1'))
    const limit = Number(url.get('limit', '20'))

    const [qInput, setQInput] = useState(q)
    const prevSearchRef = useRef(q)
    const debouncedQ = useDebouncedValue(qInput, 300)

    useEffect(() => {
        setQInput(q)
        prevSearchRef.current = q
    }, [])

    useEffect(() => {
        if (debouncedQ === prevSearchRef.current) return
        prevSearchRef.current = debouncedQ
        url.setMany({ q: debouncedQ, page: 1 }, { replace: true })
    }, [debouncedQ, url])

    const setNivell = (v: string) =>
        url.setMany({ nivell: v, page: 1 })

    const setSort = (v: string) =>
        url.setMany({ sort: v, page: 1 })

    const clearFilters = () =>
        url.setMany({ q: '', nivell: '', sort: 'created_at_desc', page: 1 })

    const setPage = (p: number) => url.setMany({ page: p })
    const setLimit = (l: number) => url.setMany({ limit: l, page: 1 })

    const apiParams: SearchUsersParams = useMemo(() => ({
        q: debouncedQ || undefined,
        nivell: nivell || undefined,
        sort: sort as SearchUsersParams['sort'],
        page,
        limit,
    }), [debouncedQ, nivell, sort, page, limit])

    return {
        qInput, setQInput,
        nivell, setNivell,
        sort, setSort,
        page, limit, setPage, setLimit,
        clearFilters,
        apiParams,
    }
}
