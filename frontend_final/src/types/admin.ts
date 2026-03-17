export interface EstadistiquesAdminWeb {
    usuaris: { total: number; actius: number; inactius: number };
    equips: { total: number; actius: number };
    lligues: { total: number; actives: number };
    partits: { total: number; pendents: number; completats: number };
    arbitres: { total: number };
}

export interface UsuariAdmin {
    id: string;
    nom: string;
    email: string;
    telefon?: string;
    nivell?: string;
    avatar?: string;
    isActive: boolean;
    rols: string[];
    created_at?: string;
}

export interface EquipAdmin {
    id: string;
    nom: string;
    categoria?: string;
    isActive: boolean;
    lliga?: { id: string; nom: string } | null;
    totalMembres: number;
    created_at?: string;
}

export interface LligaAdmin {
    id: string;
    nom: string;
    categoria?: string;
    isActive: boolean;
    totalEquips: number;
}

export type PartitStatus = 'PENDENT' | 'PROGRAMAT' | 'EN_CURS' | 'COMPLETAT' | 'CANCEL·LAT';

export interface PartitAdmin {
    id: string;
    localId: string;
    localNom?: string;
    visitantId: string;
    visitantNom?: string;
    data?: string;
    hora?: string;
    ubicacio?: string;
    status: PartitStatus;
    setsLocal: number;
    setsVisitant: number;
    arbitreId?: string;
    arbitreNom?: string;
    isActive: boolean;
}

export interface ArbitreAdmin {
    id: string;
    nom: string;
    email: string;
    telefon?: string;
    avatar?: string;
    partitsAssignats: number;
    partitsPendents: number;
}

export interface MembreEquip {
    id: string;
    usuariId: string;
    nom?: string;
    email?: string;
    rolEquip?: string;
}

export interface ClassificacioEntry {
    posicio: number;
    equipId: string;
    nom?: string;
    pj: number;
    g: number;
    p: number;
    gf: number;
    gc: number;
    diff: number;
    pts: number;
    lligaNom?: string;
}

export interface CreateEquipData {
    nom: string;
    categoria?: string;
    lligaId?: string;
}

export interface UpdateEquipData {
    nom?: string;
    categoria?: string;
    lligaId?: string;
    isActive?: boolean;
}

export interface CreateLligaData {
    nom: string;
    categoria?: string;
}

export interface UpdateLligaData {
    nom?: string;
    categoria?: string;
    isActive?: boolean;
}

export interface CreatePartitData {
    localId: string;
    visitantId: string;
    data?: string;
    hora?: string;
    ubicacio?: string;
    lligaId?: string;
}

export interface UpdatePartitData {
    status?: PartitStatus;
    setsLocal?: number;
    setsVisitant?: number;
    data?: string;
    hora?: string;
    ubicacio?: string;
    isActive?: boolean;
}
