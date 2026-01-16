import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import React from 'react';

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
                p-2 border rounded bg-white cursor-grab hover:bg-gray-100 text-sm
                ${isDragging ? 'opacity-50' : ''}
            `}
        >
            {jugador.nom || jugador.nombre}
        </div>
    );
};

export default DraggableJugador;
