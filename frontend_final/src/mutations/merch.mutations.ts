import { createMerch, deleteMerch, updateMerch, createCompra, updateCompra, deleteCompra } from "@/services/merch.service"
import type { CreateMerchRequest, UpdateMerchRequest, CreateCompraRequest, UpdateCompraRequest } from "@/types/merch"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useCreateMerch = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateMerchRequest) => createMerch(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['merchs'] })
        }
    })
}

export const useUpdateMerch = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: UpdateMerchRequest }) => updateMerch(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['merchs'] })
        }
    })
}

export const useDeleteMerch = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteMerch(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['merchs'] })
            queryClient.invalidateQueries({ queryKey: ['compras', 'merch'] })
        }
    })
}

export const useCreateCompra = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateCompraRequest) => createCompra(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['compras', 'all'] })
            queryClient.invalidateQueries({ queryKey: ['compras', 'usuari'] })
            queryClient.invalidateQueries({ queryKey: ['compras', 'merch'] })
        }
    })
}

export const useUpdateCompra = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: UpdateCompraRequest }) => updateCompra(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['compras'] })
        }
    })
}

export const useDeleteCompra = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteCompra(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['compras', 'all'] })
            queryClient.invalidateQueries({ queryKey: ['compras', 'usuari'] })
            queryClient.invalidateQueries({ queryKey: ['compras', 'merch'] })
        }
    })
}
