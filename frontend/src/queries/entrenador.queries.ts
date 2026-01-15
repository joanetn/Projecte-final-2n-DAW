import { getPartitsJugats, getPartitsPendents, getPlantilla } from "@/services/entrenador.service"
import { MembrePlantilla } from "@/types/entrenador"
import { PartitsDashboardEntrenador } from "@/types/partits"
import { useQuery } from "@tanstack/react-query"

export const usePlantilla = () =>
    useQuery<MembrePlantilla[]>({
        queryKey: ["plantilla"],
        queryFn: getPlantilla
    })

export const usePartitsJugats = () =>
    useQuery<PartitsDashboardEntrenador[]>({
        queryKey: ["partitsJugats"],
        queryFn: getPartitsJugats
    })

export const usePartitsPendents = () =>
    useQuery<PartitsDashboardEntrenador[]>({
        queryKey: ["partitsPendents"],
        queryFn: getPartitsPendents
    })