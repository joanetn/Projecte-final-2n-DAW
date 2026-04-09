import { getCategories, getLeagueAdmin, getLeagueDetail, getLeagueDetailAdmin, getLeagues, getLeaguesAdmin } from "@/services/leagues.service"
import { useQuery } from "@tanstack/react-query"
import type { LeaguesAdminResponse } from '@/types/leagues'

export const LEAGUE_KEYS = {
    all: ['leagues', 'all'] as const,
    admin: ['leagues', 'admin'] as const,
    one: (id: string) => ['leagues', 'one', id] as const,
    categories: ['leagues', 'categories'] as const,
    detailAdmin: (id: string) => ['leagues', 'detail', 'admin', id] as const,
    detail: (id: string) => ['leagues', 'detail', id] as const
}

export const useGetLeagues = () =>
    useQuery({
        queryKey: LEAGUE_KEYS.all,
        queryFn: getLeagues
    })

export const useGetLeaguesAdmin = () =>
    useQuery<{ lligues: LeaguesAdminResponse[]; total: number }>({
        queryKey: LEAGUE_KEYS.admin,
        queryFn: getLeaguesAdmin
    })

export const useGetLeagueAdmin = (id: string) =>
    useQuery({
        queryKey: LEAGUE_KEYS.one(id),
        queryFn: () => getLeagueAdmin(id),
        enabled: !!id,
    })

export const useGetCategories = () =>
    useQuery({
        queryKey: LEAGUE_KEYS.categories,
        queryFn: getCategories
    })

export const useGetLeagueDetailAdmin = (id: string) =>
    useQuery({
        queryKey: LEAGUE_KEYS.detailAdmin(id),
        queryFn: () => getLeagueDetailAdmin(id),
        enabled: !!id,
    })

export const useGetLeagueDetail = (id: string) =>
    useQuery({
        queryKey: LEAGUE_KEYS.detail(id),
        queryFn: () => getLeagueDetail(id),
        enabled: !!id,
    })