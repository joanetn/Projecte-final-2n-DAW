import { getInsurances } from "@/services/insurance.service"
import { useQuery } from "@tanstack/react-query"

export const useGetInsurances = () => {
    return useQuery({
        queryKey: ['getInsurances'],
        queryFn: getInsurances
    })
}