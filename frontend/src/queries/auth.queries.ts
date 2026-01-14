import { useQuery } from "@tanstack/react-query";
import { getUsuaris } from "../services/auth.service";
import { User } from "../types/auth";

export const useUsers = () =>
    useQuery<User[]>({
        queryKey: ["users"],
        queryFn: getUsuaris,
    });
