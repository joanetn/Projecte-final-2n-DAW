import { getNotificacions, getPropostesEnviades, getPropostesRebudes } from "@/services/notificacions.service";
import { useQuery } from "@tanstack/react-query";

export const useNotificacions = (usuariId: string | undefined) =>
    useQuery<any[]>({
        queryKey: ["notificacions", usuariId],
        queryFn: () => getNotificacions(usuariId!),
        enabled: !!usuariId,
    });

export const usePropostesEnviades = (equipId: string | undefined) =>
    useQuery<any[]>({
        queryKey: ["propostes-enviades", equipId],
        queryFn: () => getPropostesEnviades(equipId!),
        enabled: !!equipId,
    });

export const usePropostesRebudes = (equipId: string | undefined) =>
    useQuery<any[]>({
        queryKey: ["propostes-rebudes", equipId],
        queryFn: () => getPropostesRebudes(equipId!),
        enabled: !!equipId
    })