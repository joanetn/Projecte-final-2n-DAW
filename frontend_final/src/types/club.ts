export interface Club {
    id: string;
    nom: string;
    descripcio?: string;
    adreca?: string;
    ciutat?: string;
    codiPostal?: string;
    provincia?: string;
    email?: string;
    telefon?: string;
    web?: string;
    anyFundacio?: number;
    creadorId?: string;
    isActive?: boolean;
    ubicacio?: string;
    imatge?: string;
    equips?: Array<{
        id: string;
        nom: string;
        categoria?: string;
        isActive?: boolean;
    }>;
    createdAt?: string;
    updatedAt?: string;
    numEquips?: number;
}

export interface CreateClubData {
    nom: string;
    descripcio?: string;
    adreca?: string;
    ciutat?: string;
    codiPostal?: string;
    provincia?: string;
    email?: string;
    telefon?: string;
    web?: string;
    anyFundacio?: number;
    creadorId?: string;
    ubicacio?: string;
    imatge?: string;
}

export interface UpdateClubData {
    nom?: string;
    descripcio?: string;
    adreca?: string;
    ciutat?: string;
    codiPostal?: string;
    provincia?: string;
    email?: string;
    telefon?: string;
    web?: string;
    anyFundacio?: number;
    creadorId?: string;
    isActive?: boolean;
    ubicacio?: string;
    imatge?: string;
}

export interface Equip {
    id: string;
    nom: string;
    categoria?: string;
    lligaId?: string;
    lligaNom?: string;
    clubId?: string;
    isActive?: boolean;
    numJugadors?: number;
    rolMeu?: string;
    createdAt?: string;
}

export interface CreateEquipData {
    nom: string;
    categoria: string;
    lligaId?: string;
    clubId: string;
}

export interface UpdateEquipData {
    nom?: string;
    categoria?: string;
    lligaId?: string;
    isActive?: boolean;
}

export interface MembreEquip {
    id: string;
    usuariId: string;
    equipId: string;
    rolEquip?: string;
    isActive?: boolean;
    nom?: string;
    email?: string;
    teSeguir?: boolean;
    lesionat?: boolean;
    dataLesio?: string;
}

export interface LeagueCategoryOption {
    value: string;
    label: string;
}

export interface LligaEquip {
    id: string;
    nom: string;
    categoria?: string;
}

export interface Lliga {
    id: string;
    nom: string;
    categoria?: string;
    dataInici?: string;
    dataFi?: string;
    status?: string;
    isActive?: boolean;
    equips?: LligaEquip[];
}
