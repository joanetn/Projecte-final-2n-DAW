export interface EquipInfo {
    id: string | number;
    nom: string;
}
export interface PartitResumit {
    id: string | number;
    dataHora: string;
    status?: string;
    local: EquipInfo | null;
    visitant: EquipInfo | null;
}
export interface PartitPendentActa {
    id: string | number;
    jornadaId: number;
    localId: string | number;
    visitantId: string | number;
    dataHora: string;
    pistaId: string | number;
    status: string;
    isActive: boolean;
    local: EquipInfo | null;
    visitant: EquipInfo | null;
}
export interface Incidencia {
    id: string;
    set?: number;
    tipus: 'ADVERTENCIA' | 'CONDUCTA_ANTIESPORTIVA' | 'LESIO' | 'PROBLEMA_MATERIAL' | 'RETARD' | 'ALTRE';
    jugadorId?: string | number;
    equipId?: string | number;
    descripcio: string;
}
export interface SetResultat {
    numeroSet: number;
    jocsLocal: number;
    jocsVisitant: number;
    tiebreak: boolean;
    puntsLocalTiebreak?: number | null;
    puntsVisitantTiebreak?: number | null;
}
export interface Acta {
    id: string;
    partitId: string | number;
    arbitreId: string | number;
    sets: SetResultat[];
    setsLocal: number;
    setsVisitant: number;
    observacions: string;
    incidencies: Incidencia[] | null;
    validada: boolean;
    dataValidacio: string | null;
    created_at: string;
    updated_at?: string;
    isActive: boolean;
    partit?: PartitResumit;
}
export interface PartitsPendentsResponse {
    partits: PartitPendentActa[];
    total: number;
}
export interface MevesActesResponse {
    actes: Acta[];
    total: number;
}
export interface CrearActaRequest {
    partitId: string | number;
    sets: SetResultat[];
    observacions?: string;
    incidencies?: Incidencia[];
}
export interface ActualitzarActaRequest {
    sets?: SetResultat[];
    observacions?: string;
    incidencies?: Incidencia[];
}
export interface ActaResponse {
    success: boolean;
    acta: Acta;
    missatge: string;
}
