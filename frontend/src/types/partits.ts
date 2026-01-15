export interface PartitsDashboardEntrenador {
    id: string;
    jornadaId: number;
    localId: number;
    visitantId: number;
    status: "PENDENT" | "COMPLETAT" | "CANCELAT";
    isActive: true;
}