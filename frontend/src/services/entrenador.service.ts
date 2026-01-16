import { backend_rapid } from "@/api/axios";
import { PlantillaResponse } from "@/types/entrenador";
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