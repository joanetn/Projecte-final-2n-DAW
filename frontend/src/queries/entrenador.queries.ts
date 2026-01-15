import { getPartits, getPlantilla } from "@/services/entrenador.service"
import { MembrePlantilla } from "@/types/entrenador"
import { PartitsDashboardEntrenador } from "@/types/partits"
import { useQuery } from "@tanstack/react-query"

export const usePlantilla = () =>
    useQuery<MembrePlantilla[]>({
        queryKey: ["plantilla"],
        queryFn: getPlantilla
    })

export const usePartits = () =>
    useQuery<PartitsDashboardEntrenador[]>({
        queryKey: ["partits"],
        queryFn: getPartits
    })