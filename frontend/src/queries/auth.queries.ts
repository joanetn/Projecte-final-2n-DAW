import { useQuery } from "@tanstack/react-query";
import { getUsuaris, getCurrentUserData, getTeEquip } from "../services/auth.service";
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
    });

export const useTeEquip = () =>
    useQuery<any>({
        queryKey: ["teEquip"],
        queryFn: getTeEquip
    })