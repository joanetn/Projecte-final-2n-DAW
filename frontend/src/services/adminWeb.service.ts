import { backend_rapid } from "@/api/axios";
const BASE_URL = "/admin-web";
export interface EstadistiquesAdminWeb {
    usuaris: { total: number; actius: number; inactius: number };
    equips: { total: number; actius: number };
    lligues: { total: number; actives: number };
    partits: { total: number; pendents: number; completats: number };
    arbitres: { total: number };
}
export interface UsuariAdmin {
    id: string;
    nom: string;
    email: string;
    telefon?: string;
    nivell?: string;
    avatar?: string;
    isActive: boolean;
    rols: string[];
    created_at?: string;
}
export interface EquipAdmin {
    id: string;
    nom: string;
    categoria: string;
    isActive: boolean;
    lliga: { id: string; nom: string } | null;
    totalMembres: number;
    created_at?: string;
}
export interface LligaAdmin {
    id: string;
    nom: string;
    categoria: string;
    isActive: boolean;
    totalEquips: number;
}
export interface PartitAdmin {
    id: string;
    localId: string;
    localNom: string;
    visitantId: string;
    visitantNom: string;
    data: string;
    hora?: string;
    ubicacio?: string;
    status: string;
    setsLocal: number;
    setsVisitant: number;
    arbitreId?: string;
    isActive: boolean;
}
export interface ArbitreAdmin {
    id: string;
    nom: string;
    email: string;
    telefon?: string;
    avatar?: string;
    partitsAssignats: number;
    partitsPendents: number;
}
export interface MembreEquip {
    id: string;
    usuariId: string;
    nom: string;
    email: string;
    rolEquip: string;
}
export const getEstadistiquesAdminWeb = async (): Promise<EstadistiquesAdminWeb> => {
    const response = await backend_rapid.get(`${BASE_URL}/estadistiques`);
    return response.data;
};
export const getUsuarisAdmin = async (params?: {
    rol?: string;
    actiu?: string;
    cerca?: string;
}): Promise<{ usuaris: UsuariAdmin[]; total: number }> => {
    const response = await backend_rapid.get(`${BASE_URL}/usuaris`, { params });
    return response.data;
};
export const toggleUsuariActiu = async (usuariId: string): Promise<{ success: boolean; message: string }> => {
    const response = await backend_rapid.patch(`${BASE_URL}/usuaris/${usuariId}/toggle`);
    return response.data;
};
export const canviarRolsUsuari = async (usuariId: string, rols: string[]): Promise<{ success: boolean; message: string }> => {
    const response = await backend_rapid.patch(`${BASE_URL}/usuaris/${usuariId}/rols`, { rols });
    return response.data;
};
export const eliminarUsuari = async (usuariId: string): Promise<{ success: boolean; message: string }> => {
    const response = await backend_rapid.delete(`${BASE_URL}/usuaris/${usuariId}`);
    return response.data;
};
export const getEquipsAdmin = async (params?: {
    lligaId?: string;
    actiu?: string;
    cerca?: string;
}): Promise<{ equips: EquipAdmin[]; total: number }> => {
    const response = await backend_rapid.get(`${BASE_URL}/equips`, { params });
    return response.data;
};
export const crearEquip = async (data: {
    nom: string;
    categoria?: string;
    lligaId?: string;
}): Promise<{ success: boolean; equip: EquipAdmin }> => {
    const response = await backend_rapid.post(`${BASE_URL}/equips`, data);
    return response.data;
};
export const actualitzarEquip = async (equipId: string, data: {
    nom?: string;
    categoria?: string;
    lligaId?: string;
    isActive?: boolean;
}): Promise<{ success: boolean; message: string }> => {
    const response = await backend_rapid.patch(`${BASE_URL}/equips/${equipId}`, data);
    return response.data;
};
export const eliminarEquip = async (equipId: string): Promise<{ success: boolean; message: string }> => {
    const response = await backend_rapid.delete(`${BASE_URL}/equips/${equipId}`);
    return response.data;
};
export const getMembresEquip = async (equipId: string): Promise<{ membres: MembreEquip[]; total: number }> => {
    const response = await backend_rapid.get(`${BASE_URL}/equips/${equipId}/membres`);
    return response.data;
};
export const getLliguesAdmin = async (): Promise<{ lligues: LligaAdmin[]; total: number }> => {
    const response = await backend_rapid.get(`${BASE_URL}/lligues`);
    return response.data;
};
export const crearLliga = async (data: {
    nom: string;
    categoria?: string;
}): Promise<{ success: boolean; lliga: LligaAdmin }> => {
    const response = await backend_rapid.post(`${BASE_URL}/lligues`, data);
    return response.data;
};
export const actualitzarLliga = async (lligaId: string, data: {
    nom?: string;
    categoria?: string;
    isActive?: boolean;
}): Promise<{ success: boolean; message: string }> => {
    const response = await backend_rapid.patch(`${BASE_URL}/lligues/${lligaId}`, data);
    return response.data;
};
export const eliminarLliga = async (lligaId: string): Promise<{ success: boolean; message: string }> => {
    const response = await backend_rapid.delete(`${BASE_URL}/lligues/${lligaId}`);
    return response.data;
};
export const getPartitsAdmin = async (params?: {
    status?: string;
    cerca?: string;
}): Promise<{ partits: PartitAdmin[]; total: number }> => {
    const response = await backend_rapid.get(`${BASE_URL}/partits`, { params });
    return response.data;
};
export const crearPartit = async (data: {
    localId: string;
    visitantId: string;
    data: string;
    hora?: string;
    ubicacio?: string;
    lligaId?: string;
}): Promise<{ success: boolean; partit: PartitAdmin }> => {
    const response = await backend_rapid.post(`${BASE_URL}/partits`, data);
    return response.data;
};
export const actualitzarPartit = async (partitId: string, data: {
    data?: string;
    hora?: string;
    ubicacio?: string;
    status?: string;
    setsLocal?: number;
    setsVisitant?: number;
    arbitreId?: string;
}): Promise<{ success: boolean; message: string }> => {
    const response = await backend_rapid.patch(`${BASE_URL}/partits/${partitId}`, data);
    return response.data;
};
export const eliminarPartit = async (partitId: string): Promise<{ success: boolean; message: string }> => {
    const response = await backend_rapid.delete(`${BASE_URL}/partits/${partitId}`);
    return response.data;
};
export const getArbitresAdmin = async (): Promise<{ arbitres: ArbitreAdmin[]; total: number }> => {
    const response = await backend_rapid.get(`${BASE_URL}/arbitres`);
    return response.data;
};
export const assignarArbitre = async (partitId: string, arbitreId: string | null): Promise<{ success: boolean; message: string }> => {
    const response = await backend_rapid.patch(`${BASE_URL}/partits/${partitId}/arbitre`, { arbitreId });
    return response.data;
};
export const getPartitsArbitre = async (arbitreId: string): Promise<{ partits: any[]; total: number }> => {
    const response = await backend_rapid.get(`${BASE_URL}/arbitres/${arbitreId}/partits`);
    return response.data;
};
export interface EquipClassificacio {
    equipId: string;
    equipNom: string;
    partitsJugats: number;
    victories: number;
    derrotes: number;
    empats: number;
    setsAFavor: number;
    setsEnContra: number;
    diferenciaSets: number;
    punts: number;
}

export interface LligaClassificacio {
    lligaId: string;
    lligaNom: string;
    classificacio: EquipClassificacio[];
}

export const getClassificacions = async (): Promise<{ classificacions: LligaClassificacio[]; total: number }> => {
    try {
        const response = await backend_rapid.get(`${BASE_URL}/classificacions`);
        return response.data;
    } catch (err: any) {
        const message = err.response?.data?.message || "Error al carregar les classificacions";
        console.error("Error en getClassificacions:", err);
        throw new Error(message);
    }
};