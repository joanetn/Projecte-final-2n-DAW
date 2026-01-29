import { backend_rapid } from "@/api/axios";

interface ClubData {
    nom: string;
    descripcio?: string;
    adreca: string;
    ciutat: string;
    codiPostal: string;
    provincia: string;
    telefon: string;
    email: string;
    web?: string;
    anyFundacio?: number;
}

interface EquipData {
    nom: string;
    categoria: string;
}

interface InstalacioData {
    nom: string;
    adreca: string;
    telefon?: string;
    tipusPista: string;
    numPistes: number;
}

interface CrearClubRequest {
    club: ClubData;
    equip: EquipData;
    instalacions?: InstalacioData[];
}

interface CrearClubResponse {
    success: boolean;
    message: string;
    clubId: string;
    equipId: string;
}

interface LligaDisponible {
    id: string;
    nom: string;
    categoria: string;
    dataInici?: string;
    dataFi?: string;
    equipsScrits?: number;
    maxEquips?: number;
    isActive: boolean;
}

interface LliguesDisponiblesResponse {
    lligues: LligaDisponible[];
    total: number;
}

interface InscriureLligaRequest {
    equipId: string;
    lligaId: string;
}

interface InscriureLligaResponse {
    success: boolean;
    message: string;
}

export const crearClub = async (data: CrearClubRequest): Promise<CrearClubResponse> => {
    const response = await backend_rapid.post("/clubs/crear", data);
    return response.data;
};

export const getLliguesDisponibles = async (): Promise<LliguesDisponiblesResponse> => {
    const response = await backend_rapid.get("/clubs/lligues-disponibles");
    return response.data;
};

export const inscriureLliga = async (data: InscriureLligaRequest): Promise<InscriureLligaResponse> => {
    const response = await backend_rapid.post("/clubs/inscriure-lliga", data);
    return response.data;
};
