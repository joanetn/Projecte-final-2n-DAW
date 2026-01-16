import { useDroppable } from "@dnd-kit/core";

const SlotJugador = ({ id, jugador, onSlotClick }: {
    id: string,
    jugador: any,
    onSlotClick?: () => void
}) => {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            onClick={onSlotClick}
            className={`
                w-24 h-12 border-2 border-dashed rounded
                flex items-center justify-center text-xs
                cursor-pointer
                ${isOver ? "border-blue-600 bg-blue-100" : "border-gray-400"}
                ${jugador ? "bg-blue-50" : ""}
            `}
        >
            {jugador ? jugador.nom || jugador.nombre : "Solta ací"}
        </div>
    );
};

export default SlotJugador;
