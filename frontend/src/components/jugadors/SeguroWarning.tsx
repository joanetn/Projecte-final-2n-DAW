import { useEstatSeguro } from "@/queries/seguro.queries";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
const SeguroWarning = () => {
    const { data: estatSeguro, isLoading } = useEstatSeguro();
    if (isLoading || estatSeguro?.teSeguro) {
        return null;
    }
    return (
        <Card className="border-orange-500 bg-orange-50 dark:bg-orange-950 mb-6">
            <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <ShieldAlert className="h-6 w-6 text-orange-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-orange-800 dark:text-orange-200">
                                No tens el segur pagat
                            </p>
                            <p className="text-sm text-orange-700 dark:text-orange-300">
                                Sense el segur no pots unir-te a equips ni ser alineat en partits.
                            </p>
                        </div>
                    </div>
                    <Link to="/jugador/seguro">
                        <Button variant="default" size="sm" className="gap-2 whitespace-nowrap">
                            <CreditCard className="h-4 w-4" />
                            Pagar Segur
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
};
export default SeguroWarning;
