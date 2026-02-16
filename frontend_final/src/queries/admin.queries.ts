import { useQuery } from "@tanstack/react-query"
import { getUsers } from "../services/user.service"
import type { User } from "../types/users"

export const useGetUsers = () =>
    useQuery<User[]>({
        queryKey: ['getUsers'],
        queryFn: getUsers
    })