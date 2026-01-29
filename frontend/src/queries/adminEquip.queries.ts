import { useQuery } from "@tanstack/react-query";
import {
    getPlantillaAdminEquip,
    getPartitsPendentsAdminEquip,
    getClassificacioAdminEquip,
    getCalendariAdminEquip,
    getEstadistiquesAdminEquip,
} from "@/services/adminEquip.service";
export const usePlantillaAdminEquip = () =>
    useQuery({
        queryKey: ["plantillaAdminEquip"],
        queryFn: getPlantillaAdminEquip,
    });
export const usePartitsPendentsAdminEquip = () =>
    useQuery({
        queryKey: ["partitsPendentsAdminEquip"],
        queryFn: getPartitsPendentsAdminEquip,
    });
export const useClassificacioAdminEquip = () =>
    useQuery({
        queryKey: ["classificacioAdminEquip"],
        queryFn: getClassificacioAdminEquip,
    });
export const useCalendariAdminEquip = () =>
    useQuery({
        queryKey: ["calendariAdminEquip"],
        queryFn: getCalendariAdminEquip,
    });
export const useEstadistiquesAdminEquip = () =>
    useQuery({
        queryKey: ["estadistiquesAdminEquip"],
        queryFn: getEstadistiquesAdminEquip,
    });
