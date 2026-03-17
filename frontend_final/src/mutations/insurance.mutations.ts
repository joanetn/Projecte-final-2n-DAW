import { createPaymentIntent } from "@/services/insurance.service"
import type { CreatePaymentIntentData } from "@/types/insurance"
import { useMutation } from "@tanstack/react-query"

export const useCreatePaymentIntent = () => {
    return useMutation({
        mutationFn: (data: CreatePaymentIntentData) => createPaymentIntent(data)
    })
}