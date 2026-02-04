import { backend_rapid } from "@/api/axios";
import type {
    PartitsPendentsResponse,
    MevesActesResponse,
    Acta,
    CrearActaRequest,
    ActualitzarActaRequest,
    ActaResponse,
} from "@/types/acta";
const BASE_URL = "/actes";
export const getPartitsPendentsActa = async (): Promise<PartitsPendentsResponse> => {
    const response = await backend_rapid.get(`${BASE_URL}/partits-pendents`);
    return response.data;
};
export const getMevesActes = async (): Promise<MevesActesResponse> => {
    const response = await backend_rapid.get(`${BASE_URL}/meves`);
    return response.data;
};
export const getActaDetall = async (id: string): Promise<Acta> => {
    const response = await backend_rapid.get(`${BASE_URL}/${id}`);
    return response.data;
};
export const crearActa = async (data: CrearActaRequest): Promise<ActaResponse> => {
    const response = await backend_rapid.post(BASE_URL, data);
    return response.data;
};
export const actualitzarActa = async (
    id: string,
    data: ActualitzarActaRequest
): Promise<ActaResponse> => {
    const response = await backend_rapid.put(`${BASE_URL}/${id}`, data);
    return response.data;
};
export const validarActa = async (id: string): Promise<ActaResponse> => {
    const response = await backend_rapid.post(`${BASE_URL}/${id}/validar`);
    return response.data;
};
export const eliminarActa = async (id: string): Promise<{ success: boolean; missatge: string }> => {
    const response = await backend_rapid.delete(`${BASE_URL}/${id}`);
    return response.data;
};

export const marcarPartitCompletat = async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await backend_rapid.patch(`${BASE_URL}/partit/${id}/completar`);
    return response.data;
};
