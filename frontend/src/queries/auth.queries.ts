import { useQuery } from "@tanstack/react-query";
import { getUsuaris, getCurrentUserData } from "../services/auth.service";
import { User } from "../types/auth";
export const useUsers = () =>
    useQuery<User[]>({
        queryKey: ["users"],
        queryFn: getUsuaris,
    });
export const useCurrentUserQuery = () =>
    useQuery<User>({
        queryKey: ["currentUser"],
        queryFn: getCurrentUserData,
        retry: false,
        staleTime: 1000 * 60 * 5,
    });
