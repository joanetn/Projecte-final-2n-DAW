export interface Puntuacio {
    id?: string;
    partitId: string;
    equipId: string;
    punts: number;
    stats?: Record<string, unknown>;
    observacions?: string;
}

export interface SetResultat {
    local: number;
    visitant: number;
}

export interface ActaData {
    partitId: string;
    sets: SetResultat[];
    observacions?: string;
    duracio?: number;
}
