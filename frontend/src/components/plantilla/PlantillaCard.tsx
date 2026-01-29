import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import { type PlantillaCardProps } from "@/types/components.plantilla";
const PlantillaCard = ({ usuari, teSeguro }: PlantillaCardProps) => (
    <Card className={`hover:shadow-md transition ${teSeguro === false ? 'border-orange-300 bg-orange-50/30 dark:bg-orange-950/20' : ''}`}>
        <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{usuari.nom}</CardTitle>
                        {teSeguro !== undefined && (
                            teSeguro ? (
                                <span title="Segur pagat">
                                    <ShieldCheck className="h-4 w-4 text-green-600" />
                                </span>
                            ) : (
                                <span title="Sense segur">
                                    <ShieldAlert className="h-4 w-4 text-orange-500" />
                                </span>
                            )
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground">{usuari.email}</p>
                    {usuari.telefon && (
                        <p className="text-xs text-muted-foreground/70 mt-1">{usuari.telefon}</p>
                    )}
                </div>
                {usuari.avatar && (
                    <img
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
                {teSeguro === false && (
                    <Badge variant="destructive" className="text-xs gap-1">
                        <ShieldAlert className="h-3 w-3" />
                        Sense segur
                    </Badge>
                )}
            </div>
        </CardContent>
    </Card>
);
export default PlantillaCard;
