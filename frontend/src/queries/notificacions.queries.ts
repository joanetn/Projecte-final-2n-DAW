import { getNotificacions, getPropostesEnviades, getPropostesRebudes, getPistes } from "@/services/notificacions.service";
import { useQuery } from "@tanstack/react-query";
import { Notificacio, Pista } from "@/types/notificacions";

export const useNotificacions = (usuariId: string | undefined) =>
    useQuery<Notificacio[]>({
        queryKey: ["notificacions", usuariId],
        queryFn: () => getNotificacions(usuariId!),
        enabled: !!usuariId,
    });

export const usePropostesEnviades = (equipId: string | undefined) =>
    useQuery<Notificacio[]>({
        queryKey: ["propostes-enviades", equipId],
        queryFn: () => getPropostesEnviades(equipId!),
        enabled: !!equipId,
    });

export const usePropostesRebudes = (equipId: string | undefined) =>
    useQuery<Notificacio[]>({
        queryKey: ["propostes-rebudes", equipId],
        queryFn: () => getPropostesRebudes(equipId!),
        enabled: !!equipId
    });

export const usePistes = () =>
    useQuery<Pista[]>({
        queryKey: ["pistes"],
        queryFn: () => getPistes(),
    });