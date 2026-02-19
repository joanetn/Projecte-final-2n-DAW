import { getLeagues } from "@/services/leagues.service"
import { useQuery } from "@tanstack/react-query"

export const useGetLeagues = () =>
    useQuery({
        queryKey: ['leagues'],
        queryFn: getLeagues
    })
