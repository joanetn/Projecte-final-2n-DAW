import { useGetLeagues } from "@/queries/leagues.queries";
import { useEffect } from "react";

export function Leagues() {
    const { data: response, isLoading, error } = useGetLeagues()

    const lligues = response?.data ?? []

    useEffect(() => {
        console.log(lligues)
    }, [lligues])

    return (
        <>
        </>
    )
}