import { backend_rapid } from "@/api/axios";
import { AlineacioData, AlineacioResponse, CalendariResponse, ClassificacioResponse, EstadistiquesResponse, PlantillaResponse } from "@/types/entrenador";
import { PartitsResponse } from "@/types/partits";
export const getPlantilla = async (): Promise<PlantillaResponse> => {
    try {
        const res = await backend_rapid.get<PlantillaResponse>('/entrenador/plantilla');
        return res.data;
    } catch (err: any) {
        console.error("Error obtenint plantilla:", err);
        throw new Error(err.response?.data?.message || "Error obtenint la plantilla");
    }
}
export const getPartitsJugats = async (): Promise<PartitsResponse> => {
    try {
        const res = await backend_rapid.get<PartitsResponse>('/entrenador/partitsJugats');
        return res.data;
    } catch (err: any) {
        console.error("Error obtenint partits jugats:", err);
        throw new Error(err.response?.data?.message || "Error obtenint els partits jugats");
    }
}
export const getPartitsPendents = async (): Promise<PartitsResponse> => {
    try {
        const res = await backend_rapid.get<PartitsResponse>('/entrenador/partitsPendents');
        return res.data;
    } catch (err: any) {
        console.error("Error obtenint partits pendents:", err);
        throw new Error(err.response?.data?.message || "Error obtenint els partits pendents");
    }
}
export const getEnviarAlineacio = async (body: AlineacioData): Promise<AlineacioResponse> => {
    try {
        const res = await backend_rapid.post<AlineacioResponse>('/entrenador/enviarAlineacio', body);
        return res.data;
    } catch (err: any) {
        console.error("Error manant la alineació:", err);
        throw new Error(err.response?.data?.message || "Error manant la alineació");
    }
}
export const getComprovarAlineacio = async (partitId?: string): Promise<any> => {
    try {
        if (!partitId) throw new Error("partitId is required");
        const res = await backend_rapid.get<any>(`/entrenador/${partitId}`);
        console.log(res.data);
        return res.data;
    } catch (err: any) {
        console.error("Error manant la alineació:", err);
        throw new Error(err.response?.data?.message || "Error manant la alineació");
    }
}
export const postProposta = async (body: { fromEquipId: any; toEquipId: any; dataHora: string; pistaId?: any; partitId?: any }) => {
    try {
        const res = await backend_rapid.post('/propostes', body);
        return res.data;
    } catch (err: any) {
        console.error('Error enviant proposta:', err);
        throw new Error(err.response?.data?.message || 'Error enviant proposta');
    }
}
export const getClassificacio = async (): Promise<ClassificacioResponse> => {
    try {
        const res = await backend_rapid.get<ClassificacioResponse>('/entrenador/classificacio');
        return res.data;
    } catch (err: any) {
        console.error("Error obtenint classificació:", err);
        throw new Error(err.response?.data?.message || "Error obtenint la classificació");
    }
}
export const getCalendari = async (): Promise<CalendariResponse> => {
    try {
        const res = await backend_rapid.get<CalendariResponse>('/entrenador/calendari');
        return res.data;
    } catch (err: any) {
        console.error("Error obtenint calendari:", err);
        throw new Error(err.response?.data?.message || "Error obtenint el calendari");
    }
}
export const getEstadistiques = async (): Promise<EstadistiquesResponse> => {
    try {
        const res = await backend_rapid.get<EstadistiquesResponse>('/entrenador/estadistiques');
        return res.data;
    } catch (err: any) {
        console.error("Error obtenint estadístiques:", err);
        throw new Error(err.response?.data?.message || "Error obtenint les estadístiques");
    }
}
