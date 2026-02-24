export interface LeaguesResponse {
    id: string;
    nom: string;
    categoria: string;
    dataInici: string;
    dataFi: string;
    status: string;
    logo_url: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
}