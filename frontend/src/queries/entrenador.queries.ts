import { getComprovarAlineacio, getPartitsJugats, getPartitsPendents, getPlantilla } from "@/services/entrenador.service"
import { PlantillaResponse } from "@/types/entrenador"
import { PartitsResponse } from "@/types/partits"
import { useQuery } from "@tanstack/react-query"

export const usePlantilla = () =>
    useQuery<PlantillaResponse>({
        queryKey: ["plantilla"],
        queryFn: getPlantilla
    })

export const usePartitsJugats = () =>
    useQuery<PartitsResponse>({
        queryKey: ["partitsJugats"],
        queryFn: getPartitsJugats
    })

export const usePartitsPendents = () =>
    useQuery<PartitsResponse>({
        queryKey: ["partitsPendents"],
        queryFn: getPartitsPendents
    })

export const useComprovarAlineacions = () =>
    useQuery<any>({
        queryKey: ["comprovarAlineacions"],
        queryFn: getComprovarAlineacio
    })