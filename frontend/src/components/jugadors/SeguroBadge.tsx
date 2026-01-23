import { useEstatSeguro } from "@/queries/seguro.queries";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ShieldAlert, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface SeguroBadgeProps {
    showLink?: boolean;
    size?: "sm" | "md" | "lg";
}

const SeguroBadge = ({ showLink = true, size = "md" }: SeguroBadgeProps) => {
    const { data: estatSeguro, isLoading } = useEstatSeguro();

    if (isLoading) {
        return (
            <Badge variant="outline" className="gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Carregant...</span>
            </Badge>
        );
    }

    const sizeClasses = {
        sm: "text-xs py-0.5 px-2",
        md: "text-sm py-1 px-3",
        lg: "text-base py-1.5 px-4"
    };

    const iconSizes = {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-5 w-5"
    };

    const content = estatSeguro?.teSeguro ? (
        <Badge
            variant="default"
            className={`gap-1 bg-green-600 hover:bg-green-700 ${sizeClasses[size]}`}
        >
            <ShieldCheck className={iconSizes[size]} />
            <span>Segur Actiu</span>
            {estatSeguro.seguro && estatSeguro.seguro.diesRestants <= 30 && (
                <span className="text-yellow-200">({estatSeguro.seguro.diesRestants}d)</span>
            )}
        </Badge>
    ) : (
        <Badge
            variant="destructive"
            className={`gap-1 ${sizeClasses[size]}`}
        >
            <ShieldAlert className={iconSizes[size]} />
            <span>Sense Segur</span>
        </Badge>
    );

    if (showLink) {
        return (
            <Link to="/jugador/seguro" className="hover:opacity-80 transition-opacity">
                {content}
            </Link>
        );
    }

    return content;
};

export default SeguroBadge;
