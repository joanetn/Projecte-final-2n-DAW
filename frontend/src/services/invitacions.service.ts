import { backend_rapid } from "@/api/axios"
import { InvitacioData, InvitacionsEnviadesResponse, InvitacioResponse, JugadorsDisponiblesResponse } from "@/types/invitacions"

export const getJugadorsDisponibles = async (): Promise<JugadorsDisponiblesResponse> => {
    try {
        const res = await backend_rapid.get(`/invitacions/jugadors-disponibles`);
        return res.data;
    } catch (err: any) {
        const message = err.response?.data?.message || "Error al trobar els jugadors disponibles";
        console.error("Error en getJugadorsDisponibles:", err);
        throw new Error(message);
    }
};

export const getEnviarInvitacio = async (body: InvitacioData) => {
    try {
        const res = await backend_rapid.post(`/invitacions/enviar`, body);
        return res.data;
    } catch (err: any) {
        const message = err.response?.data?.message || "Error al manar l'invitació";
        console.error("Error en getEnviarInvitacio:", err);
        throw new Error(message);
    }
}

export const getInvitacionsEnviades = async () => {
    try {
        const res = await backend_rapid.get<InvitacionsEnviadesResponse>(`/invitacions/enviades`);
        return res.data;
    } catch (err: any) {
        const message = err.response?.data?.message || "Error al carregar les invitacions";
        console.error("Error en getInvitacionsEnviades:", err);
        throw new Error(message);
    }
}

export const getCancelarInvitacio = async (id: string) => {
    try {
        const res = await backend_rapid.delete(`/invitacions/${id}`);
        return res.data;
    } catch (err: any) {
        const message = err.response?.data?.message || "Error al cancel·lar l'invitació";
        console.error("Error en getCancelarInvitacio:", err);
        throw new Error(message);
    }
}