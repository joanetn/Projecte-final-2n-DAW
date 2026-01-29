export interface PlantillaCardProps {
    usuari: any;
    teSeguro?: boolean;
}

export interface PlantillaCardAdminProps {
    usuari: any;
    teSeguro?: boolean;
    onCanviarRol: (membreId: string, rols: string[]) => void;
    onDonarBaixa: (membreId: string) => void;
    isCurrentUser?: boolean;
}
