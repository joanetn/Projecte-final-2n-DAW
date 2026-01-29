import { getCalendari, getClassificacio, getComprovarAlineacio, getEstadistiques, getPartitsJugats, getPartitsPendents, getPlantilla } from "@/services/entrenador.service"
import { CalendariResponse, ClassificacioResponse, EstadistiquesResponse, PlantillaResponse } from "@/types/entrenador"
import { PartitsResponse } from "@/types/partits"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
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
export const useComprovarAlineacions = () => {
    const { partitId } = useParams();
    return useQuery<any>({
        queryKey: ["comprovarAlineacions", partitId],
        queryFn: () => getComprovarAlineacio(partitId as string),
    })
}
export const useClassificacio = () =>
    useQuery<ClassificacioResponse>({
        queryKey: ["classificacio"],
        queryFn: getClassificacio
    })
export const useCalendari = () =>
    useQuery<CalendariResponse>({
        queryKey: ["calendari"],
        queryFn: getCalendari
    })
export const useEstadistiques = () =>
    useQuery<EstadistiquesResponse>({
        queryKey: ["estadistiques"],
        queryFn: getEstadistiques
    })
