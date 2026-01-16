export interface MembrePlantilla {
    id: number;
    nom: string;
    email: string;
    telefon?: string;
    nivell?: string;
    avatar?: string;
    dataNaixement?: string;
    rolEquip: "JUGADOR" | "ENTRENADOR" | "ADMIN_EQUIP";
    rolsGlobals: string[];
}

export interface PlantillaAgrupada {
    entrenadors: MembrePlantilla[];
    jugadors: MembrePlantilla[];
    administradors: MembrePlantilla[];
}

export interface EquipInfo {
    id: number;
    nom: string;
    categoria: string;
}

export interface PlantillaResponse {
    equip: EquipInfo | null;
    plantilla: PlantillaAgrupada;
    total: number;
}

export interface AlineacioData {
    jugadorsId: number[];
    partitId: string;
}

export interface Alineacio {
    id: string;
    jugadorId: string;
    partitId: string;
    isActive: boolean;
    equipId: number;
    creada_at: Date;
}

export interface AlineacioResponse {
    alineacions: Alineacio[];
}