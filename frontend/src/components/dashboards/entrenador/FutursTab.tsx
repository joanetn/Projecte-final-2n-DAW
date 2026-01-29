import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import PartitCard from "@/components/partits/PartitCard";
import type { UseQueryResult } from "@tanstack/react-query";

interface FutursTabProps {
    partitsPendents: UseQueryResult<any, unknown>;
}

export function FutursTab({ partitsPendents }: FutursTabProps) {
    if (partitsPendents.isLoading) {
        return (
            <div className="flex items-center justify-center h-[40vh]">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">
                    Carregant partits...
                </span>
            </div>
        );
    }

    if (partitsPendents.isError) {
        return (
            <Card>
                <CardContent className="pt-6 text-center text-red-600">
                    Error carregant els partits pendents
                </CardContent>
            </Card>
        );
    }

    if (
        !partitsPendents.isLoading &&
        partitsPendents.data &&
        partitsPendents.data.total === 0
    ) {
        return (
            <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                    No hi ha partits pendents
                </CardContent>
            </Card>
        );
    }

    if (
        !partitsPendents.isLoading &&
        partitsPendents.data &&
        partitsPendents.data.total > 0
    ) {
        return (
            <div className="space-y-4">
                {partitsPendents.data.partits.map((partit: any) => (
                    <PartitCard key={partit.id} partit={partit} />
                ))}
            </div>
        );
    }

    return null;
}
