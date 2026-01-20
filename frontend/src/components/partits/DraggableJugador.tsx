import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import React from 'react';
import { GripVertical, User } from "lucide-react";

const DraggableJugador = ({ jugador }: any) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: jugador.id
    });

    const style: React.CSSProperties = {
        transform: CSS.Translate.toString(transform),
        position: isDragging ? 'absolute' : 'static',
        zIndex: isDragging ? 1000 : 'auto'
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`
                p-3 rounded-lg bg-card border border-border
                cursor-grab active:cursor-grabbing
                hover:bg-accent hover:border-primary/50
                transition-all duration-200 ease-in-out
                flex items-center gap-3
                ${isDragging ? 'opacity-30 scale-95' : 'shadow-sm hover:shadow-md'}
            `}
        >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
            </div>
            <span className="font-medium text-sm">
                {jugador.nom || jugador.nombre}
            </span>
        </div>
    );
};

export default DraggableJugador;
