import type { ProfileSessionsData } from "@/types/profile";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

export const useGetProfileSessions = () => {
    const { getSessions } = useAuth();

    return useQuery<ProfileSessionsData[]>({
        queryKey: ['getProfileSessions'],
        queryFn: getSessions
    });
}