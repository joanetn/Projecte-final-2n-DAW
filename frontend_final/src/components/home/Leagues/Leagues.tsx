import { useGetLeagues } from "@/queries/leagues.queries"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"

export function Leagues() {
    const { data: response, isLoading, error } = useGetLeagues()

    const leagues = response ?? []

    if (error) {
        return (
            <div className="w-full px-4 py-8">
                <div className="rounded-lg bg-red-50 p-4 text-red-700">
                    Error cargando las ligas
                </div>
            </div>
        )
    }

    return (
        <section className="w-full py-8 md:py-12">
            <div className="px-4 md:px-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold tracking-tight">Ligas</h2>
                    <p className="text-sm text-slate-600 mt-1">Explora todas las ligas disponibles</p>
                </div>

                <Carousel
                    opts={{
                        align: "start",
                        loop: false,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, index) => (
                                <CarouselItem
                                    key={index}
                                    className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                                >
                                    <Skeleton className="h-64 w-full rounded-lg" />
                                </CarouselItem>
                            ))
                        ) : leagues.length > 0 ? (
                            leagues.map((league) => (
                                <CarouselItem
                                    key={league.id}
                                    className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                                >
                                    <div className="group cursor-pointer">
                                        <div className="relative overflow-hidden rounded-lg bg-slate-100 h-64 mb-3 transition-transform hover:scale-105">
                                            {league.logo_url ? (
                                                <img
                                                    src={league.logo_url}
                                                    alt={league.nom}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                                                    <span className="text-2xl font-bold text-slate-500">
                                                        {league.nom?.[0] ?? "L"}
                                                    </span>
                                                </div>
                                            )}
                                            {(league.dataInici || league.dataFi) && (
                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                                    <p className="text-xs text-white font-medium line-clamp-2">
                                                        {league.dataInici && (
                                                            <span>{new Date(league.dataInici).toLocaleDateString('ca-ES')}</span>
                                                        )}
                                                        {league.dataInici && league.dataFi && (
                                                            <span> - </span>
                                                        )}
                                                        {league.dataFi && (
                                                            <span>{new Date(league.dataFi).toLocaleDateString('ca-ES')}</span>
                                                        )}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">
                                                {league.nom}
                                            </h3>
                                            {league.categoria && (
                                                <p className="text-sm text-slate-600">
                                                    {league.categoria}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))
                        ) : (
                            <CarouselItem className="w-full">
                                <div className="flex justify-center items-center h-64">
                                    <p className="text-slate-500">No hay ligas disponibles</p>
                                </div>
                            </CarouselItem>
                        )}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </section>
    )
}