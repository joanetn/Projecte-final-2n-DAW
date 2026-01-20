import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

interface PlantillaCardProps {
    usuari: any;
}

const PlantillaCard = ({ usuari }: PlantillaCardProps) => (
    <Card className="hover:shadow-md transition">
        <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <CardTitle className="text-lg">{usuari.nom}</CardTitle>
                    <p className="text-sm text-muted-foreground">{usuari.email}</p>
                    {usuari.telefon && (
                        <p className="text-xs text-muted-foreground/70 mt-1">{usuari.telefon}</p>
                    )}
                </div>
                {usuari.avatar && (
                    <img
                        src={usuari.avatar}
                        alt={usuari.nom}
                        className="h-12 w-12 rounded-full object-cover"
                    />
                )}
            </div>
        </CardHeader>

        <CardContent>
            {usuari.nivell && (
                <p className="text-sm text-muted-foreground mb-2">Nivell: {usuari.nivell}</p>
            )}
            <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                    {usuari.rolEquip}
                </Badge>
                {usuari.rolsGlobals.map((rol: string) => (
                    <Badge key={rol} variant="secondary" className="text-xs">
                        {rol}
                    </Badge>
                ))}
            </div>
        </CardContent>
    </Card>
);

export default PlantillaCard;