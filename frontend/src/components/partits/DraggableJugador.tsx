import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import React from 'react';
import { type DraggableJugadorProps } from "@/types/components.partits";
import { GripVertical, User, ShieldCheck, ShieldAlert, Ban } from "lucide-react";
const DraggableJugador = ({ jugador, teSeguro = true, disabled = false }: DraggableJugadorProps) => {
    const isDisabled = disabled || !teSeguro;
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: jugador.id,
        disabled: isDisabled
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
            {...(isDisabled ? {} : listeners)}
            {...(isDisabled ? {} : attributes)}
            className={`
                p-3 rounded-lg bg-card border border-border
                transition-all duration-200 ease-in-out
                flex items-center gap-3
                ${isDisabled
                    ? 'opacity-60 cursor-not-allowed bg-muted/50 border-orange-300'
                    : 'cursor-grab active:cursor-grabbing hover:bg-accent hover:border-primary/50'
                }
                ${isDragging ? 'opacity-30 scale-95' : 'shadow-sm hover:shadow-md'}
            `}
            title={!teSeguro ? "Aquest jugador no té el segur pagat i no pot ser alineat" : ""}
        >
            {isDisabled ? (
                <Ban className="h-4 w-4 text-orange-500" />
            ) : (
                <GripVertical className="h-4 w-4 text-muted-foreground" />
            )}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${teSeguro ? 'bg-primary/10' : 'bg-orange-100 dark:bg-orange-900/30'
                }`}>
                <User className={`h-4 w-4 ${teSeguro ? 'text-primary' : 'text-orange-500'}`} />
            </div>
            <span className="font-medium text-sm flex-1">
                {jugador.nom || jugador.nombre}
            </span>
            {teSeguro !== undefined && (
                teSeguro ? (
                    <span title="Segur pagat">
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                    </span>
                ) : (
                    <span title="Sense segur - No pot ser alineat">
                        <ShieldAlert className="h-4 w-4 text-orange-500" />
                    </span>
                )
            )}
        </div>
    );
};
export default DraggableJugador;
