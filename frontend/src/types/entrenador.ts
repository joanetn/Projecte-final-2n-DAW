export interface MembrePlantilla {
    id: string;
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
    jugadorsId: any;
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
export interface CompAlineacioResponse {
    slot1: string;
    slot2: string;
}
export interface ClassificacioEquip {
    id: string;
    lligaId: number;
    equipId: number;
    partitsJugats: number;
    partitsGuanyats: number;
    partitsPerduts: number;
    partitsEmpatats: number;
    setsGuanyats: number;
    setsPerduts: number;
    jocsGuanyats: number;
    jocsPerduts: number;
    punts: number;
    posicio: number;
    esElMeuEquip: boolean;
    equip: {
        id: number;
        nom: string;
        categoria: string;
    } | null;
}
export interface ClassificacioResponse {
    lliga: {
        id: string;
        nom: string;
        categoria: string;
    };
    classificacio: ClassificacioEquip[];
    total: number;
}
export interface PartitCalendari {
    id: string;
    dataHora: string;
    status: string;
    jornadaId: string;
    esLocal: boolean;
    local: { id: number; nom: string } | null;
    visitant: { id: number; nom: string } | null;
    pista: { id: number; nom: string } | null;
    resultatLocal?: number;
    resultatVisitant?: number;
}
export interface JornadaCalendari {
    jornada: {
        id: string;
        nom: string;
        data: string;
        status: string;
    };
    partits: PartitCalendari[];
}
export interface CalendariResponse {
    lliga: {
        id: string;
        nom: string;
        categoria: string;
    } | null;
    calendari: JornadaCalendari[];
    partitsSenseJornada: PartitCalendari[];
    totalPartits: number;
}
export interface EstadisticaJugador {
    id: string;
    nom: string;
    avatar?: string;
    nivell?: string;
    partitsJugats: number;
    partitsGuanyats: number;
    partitsPerduts: number;
    setsGuanyats: number;
    setsPerduts: number;
    winRate: number;
}
export interface EstadistiquesResponse {
    estadistiques: EstadisticaJugador[];
    total: number;
}
