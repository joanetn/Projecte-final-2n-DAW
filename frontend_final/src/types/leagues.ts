export interface LeaguesResponse {
    id: string;
    nom: string;
    categoria: string;
    dataInici: string;
    dataFi: string;
    status: string;
    logo_url: string;
}

export interface LeaguesDetailResponse {
    id: string;
    nom: string;
    categoria: string;
    dataInici: string;
    dataFi: string;
    status: string;
    isActive: boolean;
    logo_url: string;
    jornades?: Jornada[];
    equips?: Equip[];
    classificacions?: Classificacio[];
}

export interface Jornada {
    id: string;
    nom: string;
    dataInici: string | null;
    dataFi: string | null;
    status: string;
}

export interface Equip {
    id: string;
    nom: string;
    categoria: string;
    clubId?: string | null;
    lligaId?: string | null;
    isActive?: boolean;
    createdAt?: string | null;
    updatedAt?: string | null;
}

export interface Classificacio {
    id: string;
    lligaId: string;
    equipId: string;
    partitsJugats: number;
    partitsGuanyats: number;
    partitsPerduts: number;
    partitsEmpatats: number;
    setsGuanyats: number;
    setsPerduts: number;
    jocsGuanyats: number;
    jocsPerduts: number;
    punts: number;
    isActive: boolean;
    createdAt?: string | null;
    updatedAt?: string | null;
}

export interface LeaguesAdminResponse {
    id: string;
    nom: string;
    categoria: string;
    dataInici: string;
    dataFi: string;
    status: string;
    isActive: boolean;
    logo_url: string;
}

export interface LeaguesDetailAdminResponse {
    id: string;
    nom: string;
    categoria: string;
    dataInici: string;
    dataFi: string;
    status: string;
    isActive: boolean;
    logo_url: string;
    jornades?: Jornada[];
    equips?: Equip[];
    classificacions?: Classificacio[];
}

export interface CreateLeagueData {
    nom: string;
    categoria: string;
    dataInici: string;
    dataFi?: string;
    status: string;
    isActive?: boolean;
    logo_url?: string;
}

export interface CreateLeagueResponse {
    id: string;
}

export interface UpdateLeagueData {
    nom?: string;
    categoria?: string;
    dataInici?: Date;
    dataFi?: Date;
    status?: string;
    isActive?: boolean;
    logo_url?: string;
}

export interface LeagueCategory {
    value: string;
    label: string;
}

export interface FastApiResponse<T> {
    status: 'success' | 'error' | 'validation_error'
    message?: string
    data?: T
    errors?: unknown
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
}

export interface ApiResponseWithoutData {
    success: boolean;
    message: string;
}