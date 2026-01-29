import { getRankingGlobal } from "@/services/ranking.service";
import { RankingGlobalResponse } from "@/types/ranking";
import { useQuery } from "@tanstack/react-query";
export const useGetRankingGlobal = () =>
    useQuery<RankingGlobalResponse[]>({
        queryKey: ["rankingGlobal"],
        queryFn: () => getRankingGlobal()
    })
