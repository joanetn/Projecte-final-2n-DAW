import { getPartitsJugats, getPartitsPendents, getPlantilla } from "@/services/entrenador.service"
import { PlantillaResponse } from "@/types/entrenador"
import { PartitsResponse } from "@/types/partits"
import { useQuery } from "@tanstack/react-query"

export const usePlantilla = () =>
    useQuery<PlantillaResponse>({
        queryKey: ["plantilla"],
        queryFn: getPlantilla,
        staleTime: 1000 * 60 * 5,
    })

export const usePartitsJugats = () =>
    useQuery<PartitsResponse>({
        queryKey: ["partitsJugats"],
        queryFn: getPartitsJugats,
        staleTime: 1000 * 60 * 2,
    })

export const usePartitsPendents = () =>
    useQuery<PartitsResponse>({
        queryKey: ["partitsPendents"],
        queryFn: getPartitsPendents,
        staleTime: 1000 * 60 * 2,
    })