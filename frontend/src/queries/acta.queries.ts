import { getMevesActes, getPartitsPendentsActa } from "@/services/acta.service"
import { useQuery } from "@tanstack/react-query"

export const usePartitsPendentsActa = () =>
    useQuery({
        queryKey: ["partitsPendentsActa"],
        queryFn: getPartitsPendentsActa
    });

export const useMevesActes = () =>
    useQuery({
        queryKey: ["mevesActes"],
        queryFn: getMevesActes
    });

export const useActaDetall = () =>
    useQuery({
        queryKey: ["actaDetall"],
        queryFn: getMevesActes
    })