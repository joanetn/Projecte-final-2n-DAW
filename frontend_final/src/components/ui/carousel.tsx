import * as React from "react"
import useEmblaCarousel, {
    type UseEmblaCarouselType,
} from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

interface CarouselProps {
    opts?: CarouselOptions
    plugins?: CarouselPlugin
    orientation?: "horizontal" | "vertical"
    className?: string
}

interface CarouselContextProps {
    carouselRef: ReturnType<typeof useEmblaCarousel>[0]
    api: CarouselApi | undefined
    scrollPrev: () => void
    scrollNext: () => void
    canScrollPrev: boolean
    canScrollNext: boolean
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
    const context = React.useContext(CarouselContext)
    if (!context) {
        throw new Error("useCarousel must be used within a <Carousel />")
    }
    return context
}

const Carousel = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
    (
        {
            orientation = "horizontal",
            opts,
            plugins,
            className,
            children,
            ...props
        },
        ref
    ) => {
        const [carouselRef, api] = useEmblaCarousel(
            {
                ...opts,
                axis: orientation === "horizontal" ? "x" : "y",
            },
            plugins
        )
        const [canScrollPrev, setCanScrollPrev] = React.useState(false)
        const [canScrollNext, setCanScrollNext] = React.useState(false)

        const scrollPrev = React.useCallback(() => {
            api?.scrollPrev()
        }, [api])

        const scrollNext = React.useCallback(() => {
            api?.scrollNext()
        }, [api])

        const handleSelect = React.useCallback((api: CarouselApi) => {
            setCanScrollPrev(api?.canScrollPrev() ?? false)
            setCanScrollNext(api?.canScrollNext() ?? false)
        }, [])

        React.useEffect(() => {
            if (!api) return

            handleSelect(api)
            api.on("reInit", handleSelect)
            api.on("select", handleSelect)

            return () => {
                api?.off("select", handleSelect)
            }
        }, [api, handleSelect])

        return (
            <CarouselContext.Provider
                value={{
                    carouselRef,
                    api,
                    scrollPrev,
                    scrollNext,
                    canScrollPrev,
                    canScrollNext,
                }}
            >
                <div
                    ref={ref}
                    className={cn("relative w-full", className)}
                    {...props}
                >
                    {children}
                </div>
            </CarouselContext.Provider>
        )
    }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    const { carouselRef } = useCarousel()

    return (
        <div ref={carouselRef} className="overflow-hidden">
            <div
                ref={ref}
                className={cn("flex", className)}
                {...props}
            />
        </div>
    )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("min-w-0 shrink-0 grow-0 basis-full", className)}
        {...props}
    />
))
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
    const { scrollPrev, canScrollPrev } = useCarousel()

    return (
        <button
            ref={ref}
            className={cn(
                "absolute left-12 top-1/2 z-40 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2 text-slate-900 shadow-sm hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed",
                className
            )}
            disabled={!canScrollPrev}
            onClick={scrollPrev}
            {...props}
        >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous slide</span>
        </button>
    )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
    const { scrollNext, canScrollNext } = useCarousel()

    return (
        <button
            ref={ref}
            className={cn(
                "absolute right-12 top-1/2 z-40 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2 text-slate-900 shadow-sm hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed",
                className
            )}
            disabled={!canScrollNext}
            onClick={scrollNext}
            {...props}
        >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next slide</span>
        </button>
    )
})
CarouselNext.displayName = "CarouselNext"

export {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
    useCarousel,
}
