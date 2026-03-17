import { useQuery, keepPreviousData } from '@tanstack/react-query'
import {
    getMerchs,
    getOneMerch,
    getCompras,
    getOneCompra,
    getComprasByUsuari,
    getComprasByMerch,
    getBrands,
} from '../services/merch.service'
import type { Merch, CompraDetail, Compra, SearchMerchsParams, SearchMerchsResponse, Brand } from '../types/merch'

export const useSearchMerchs = (params: SearchMerchsParams) =>
    useQuery<SearchMerchsResponse>({
        queryKey: ['merchs', 'all', params],
        queryFn: () => getMerchs(params),
        placeholderData: keepPreviousData,
    })

export const useGetOneMerch = (id: string | null) =>
    useQuery<Merch>({
        queryKey: ['merchs', id],
        queryFn: () => getOneMerch(id!),
        enabled: !!id,
    })

export const useGetBrands = () =>
    useQuery<Brand[]>({
        queryKey: ['merchs', 'brands'],
        queryFn: getBrands,
        staleTime: 5 * 60 * 1000,
    })

export const useGetCompras = () =>
    useQuery<Compra[]>({
        queryKey: ['compras', 'all'],
        queryFn: getCompras,
    })

export const useGetOneCompra = (id: string | null) =>
    useQuery<CompraDetail>({
        queryKey: ['compras', id],
        queryFn: () => getOneCompra(id!),
        enabled: !!id,
    })

export const useGetComprasByUsuari = (usuariId: string | null) =>
    useQuery<Compra[]>({
        queryKey: ['compras', 'usuari', usuariId],
        queryFn: () => getComprasByUsuari(usuariId!),
        enabled: !!usuariId,
    })

export const useGetComprasByMerch = (merchId: string | null) =>
    useQuery<Compra[]>({
        queryKey: ['compras', 'merch', merchId],
        queryFn: () => getComprasByMerch(merchId!),
        enabled: !!merchId,
    })
