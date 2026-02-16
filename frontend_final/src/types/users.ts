export interface User {
    id: string;
    nom: string;
    email: string;
    telefon?: string;
    dataNaixement?: string;
    nivell?: string;
    avatar?: string;
    dni?: string;
    isActive: boolean;
    createdAt?: string;
    udatedAt?: string;
}