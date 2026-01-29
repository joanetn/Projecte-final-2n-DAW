import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/utils";
import {
    canviarRolMembre,
    donarBaixaMembre,
    CanviarRolResponse,
    DonarBaixaResponse,
} from "@/services/adminEquip.service";

export const useCanviarRolMembre = () => {
    return useMutation<CanviarRolResponse, Error, { membreId: string; nouRol: string }>({
        mutationFn: ({ membreId, nouRol }) => canviarRolMembre(membreId, nouRol),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["plantillaAdminEquip"] });
        },
    });
};

export const useDonarBaixaMembre = () => {
    return useMutation<DonarBaixaResponse, Error, { membreId: string }>({
        mutationFn: ({ membreId }) => donarBaixaMembre(membreId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["plantillaAdminEquip"] });
        },
    });
};
