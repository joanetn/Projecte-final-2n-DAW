import { backend_rapid } from "@/api/axios";
import type { PlantillaResponse } from "@/types/entrenador";
const BASE_URL = "/admin-equip";
export interface PartitsPendentsResponse {
    partits: any[];
    total: number;
}
export interface ClassificacioResponse {
    classificacio: any[];
    lliga: { id: number; nom: string } | null;
}
export interface CalendariResponse {
    partits: any[];
    total: number;
    equipId?: string;
}
export interface JugadorEstadistiques {
    id: string;
    nom: string;
    partitsJugats: number;
    partitsGuanyats: number;
    partitsPerduts: number;
}
export interface EstadistiquesResponse {
    partitsJugats?: number;
    partitsGuanyats?: number;
    partitsPerduts?: number;
    setsAFavor?: number;
    setsEnContra?: number;
    jugadors?: JugadorEstadistiques[];
}
export interface CanviarRolResponse {
    success: boolean;
    message: string;
    membre: {
        id: string;
        nom: string;
        nouRol: string;
    };
}
export interface DonarBaixaResponse {
    success: boolean;
    message: string;
    membre: {
        id: string;
        nom: string;
    };
}
export const getPlantillaAdminEquip = async (): Promise<PlantillaResponse> => {
    const response = await backend_rapid.get(`${BASE_URL}/plantilla`);
    return response.data;
};
export const getPartitsPendentsAdminEquip = async (): Promise<PartitsPendentsResponse> => {
    const response = await backend_rapid.get(`${BASE_URL}/partitsPendents`);
    return response.data;
};
export const getClassificacioAdminEquip = async (): Promise<ClassificacioResponse> => {
    const response = await backend_rapid.get(`${BASE_URL}/classificacio`);
    return response.data;
};
export const getCalendariAdminEquip = async (): Promise<CalendariResponse> => {
    const response = await backend_rapid.get(`${BASE_URL}/calendari`);
    return response.data;
};
export const getEstadistiquesAdminEquip = async (): Promise<EstadistiquesResponse> => {
    const response = await backend_rapid.get(`${BASE_URL}/estadistiques`);
    return response.data;
};
export const canviarRolMembre = async (membreId: string, nouRol: string): Promise<CanviarRolResponse> => {
    const response = await backend_rapid.patch(`${BASE_URL}/membre/${membreId}/rol`, { nouRol });
    return response.data;
};
export const donarBaixaMembre = async (membreId: string): Promise<DonarBaixaResponse> => {
    const response = await backend_rapid.delete(`${BASE_URL}/membre/${membreId}`);
    return response.data;
};
