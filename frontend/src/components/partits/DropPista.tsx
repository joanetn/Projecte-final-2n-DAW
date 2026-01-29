import { useDroppable } from "@dnd-kit/core";
import { User, X } from "lucide-react";
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
                w-28 h-16 rounded-xl shadow-lg
                flex items-center justify-center gap-2
                cursor-pointer transition-all duration-200
                ${isOver
                    ? "bg-blue-500 border-2 border-blue-300 scale-110 text-white"
                    : jugador
                        ? "bg-white dark:bg-gray-800 border-2 border-green-400 text-gray-800 dark:text-gray-100 hover:border-red-400 group"
                        : "bg-white/90 dark:bg-gray-800/90 border-2 border-dashed border-white/60 text-gray-600 dark:text-gray-400 hover:bg-white hover:border-white"
                }
            `}
        >
            {jugador ? (
                <>
                    <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-xs font-semibold truncate max-w-[70px]">
                        {jugador.nom}
                    </span>
                    <X className="h-4 w-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </>
            ) : (
                <span className="text-xs font-medium">
                    {isOver ? "Solta" : "Solta ací"}
                </span>
            )}
        </div>
    );
};
export default SlotJugador;
