import { LEAGUE_KEYS } from "@/queries/leagues.queries"
import { createLeague, deleteLeagueAdmin, updateLeague, generateLeagueFixtures } from "@/services/leagues.service"
import type { CreateLeagueData, UpdateLeagueData } from "@/types/leagues"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useCreateLeague = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: CreateLeagueData) => createLeague(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: LEAGUE_KEYS.admin })
            queryClient.invalidateQueries({ queryKey: LEAGUE_KEYS.all })
        }
    })
}

export const useUpdateLeague = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateLeagueData }) => updateLeague(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: LEAGUE_KEYS.admin })
            queryClient.invalidateQueries({ queryKey: LEAGUE_KEYS.all })
            if (variables && (variables as any).id) {
                queryClient.invalidateQueries({ queryKey: LEAGUE_KEYS.one((variables as any).id) })
                queryClient.invalidateQueries({ queryKey: LEAGUE_KEYS.detailAdmin((variables as any).id) })
            }
        }
    })
}

export const useDeleteLeague = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteLeagueAdmin(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: LEAGUE_KEYS.admin })
            queryClient.invalidateQueries({ queryKey: LEAGUE_KEYS.all })
        }
    })
}

export const useGenerateLeagueFixtures = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, force = false }: { id: string; force?: boolean }) => generateLeagueFixtures(id, force),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: LEAGUE_KEYS.admin })
            if (variables && (variables as any).id) {
                queryClient.invalidateQueries({ queryKey: LEAGUE_KEYS.one((variables as any).id) })
                queryClient.invalidateQueries({ queryKey: LEAGUE_KEYS.detailAdmin((variables as any).id) })
            }
        }
    })
}