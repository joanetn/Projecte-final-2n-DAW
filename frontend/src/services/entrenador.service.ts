import { backend_rapid } from "@/api/axios";
import { MembrePlantilla } from "@/types/entrenador";
import { PartitsDashboardEntrenador } from "@/types/partits";

export const getPlantilla = async (): Promise<MembrePlantilla[]> => {
    const res = await backend_rapid.get<MembrePlantilla[]>('/entrenador/plantilla');
    return res.data;
}

export const getPartitsJugats = async (): Promise<PartitsDashboardEntrenador[]> => {
    const res = await backend_rapid.get<PartitsDashboardEntrenador[]>('/entrenador/partitsJugats');
    return res.data;
}

export const getPartitsPendents = async (): Promise<PartitsDashboardEntrenador[]> => {
    const res = await backend_rapid.get<PartitsDashboardEntrenador[]>('/entrenador/partitsPendents');
    return res.data;
}