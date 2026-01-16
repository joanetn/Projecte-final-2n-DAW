export interface EquipPartit {
    id: number;
    nom: string;
}

export interface JornadaPartit {
    id: number;
    nom: string;
}

export interface PistaPartit {
    id: number;
    nom: string;
}

export interface SetPartit {
    id: number;
    partitId: number;
    numeroSet: number;
    jocsLocal: number;
    jocsVisit: number;
    tiebreak: boolean;
    puntsLocalTiebreak?: number;
    puntsVisitTiebreak?: number;
}

export interface Partit {
    id: number;
    jornadaId: number;
    localId: number;
    visitantId: number;
    dataHora: string;
    pistaId?: number;
    status: "PENDENT" | "COMPLETAT" | "CANCELAT";
    isActive: boolean;
    local: EquipPartit | null;
    visitant: EquipPartit | null;
    jornada: JornadaPartit | null;
    pista: PistaPartit | null;
    sets?: SetPartit[];
}

export interface PartitsResponse {
    partits: Partit[];
    total: number;
}

export interface JugadorType {
    id: number;
    nom: string;
};

export type PartitsDashboardEntrenador = Partit;