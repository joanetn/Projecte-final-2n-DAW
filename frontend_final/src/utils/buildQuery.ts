interface BuildQueryParams {
    q?: string
    filters?: Record<string, string | number | undefined>
    page?: number
    limit?: number
    sort?: string
}

export function buildQuery({ q, filters, page, limit, sort }: BuildQueryParams): string {
    const params = new URLSearchParams()

    if (q) params.set('q', q)
    if (page) params.set('page', String(page))
    if (limit) params.set('limit', String(limit))
    if (sort) params.set('sort', sort)

    Object.entries(filters ?? {}).forEach(([k, v]) => {
        if (v !== '' && v != null) {
            params.set(k, String(v))
        }
    })

    return params.toString()
}
