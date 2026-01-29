export interface PartitCardProps {
    partit: any;
    showSets?: boolean;
}

export interface DraggableJugadorProps {
    jugador: any;
    isSelected?: boolean;
    isDragging?: boolean;
}

export interface DropPistaProps {
    pista: any;
    jugadors: any[];
    onDrop: (jugadorId: string) => void;
}
