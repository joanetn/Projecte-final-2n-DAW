import { useSearchParams } from 'react-router-dom'

export function useUrlState() {
    const [searchParams, setSearchParams] = useSearchParams()

    const get = (key: string, defaultValue = ''): string =>
        searchParams.get(key) ?? defaultValue

    const set = (key: string, value: string | number | null | undefined, { replace = false } = {}) => {
        const next = new URLSearchParams(searchParams)

        if (value === '' || value == null) {
            next.delete(key)
        } else {
            next.set(key, String(value))
        }

        setSearchParams(next, { replace })
    }

    const setMany = (values: Record<string, string | number | null | undefined>, { replace = false } = {}) => {
        const next = new URLSearchParams(searchParams)

        Object.entries(values).forEach(([key, value]) => {
            if (value === '' || value == null) {
                next.delete(key)
            } else {
                next.set(key, String(value))
            }
        })

        setSearchParams(next, { replace })
    }

    return { get, set, setMany }
}
