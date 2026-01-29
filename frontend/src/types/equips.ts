export interface EquipAdmin {
    id: string;
    nom: string;
    categoria: string;
    isActive: boolean;
    lliga: { id: string; nom: string } | null;
    totalMembres: number;
}