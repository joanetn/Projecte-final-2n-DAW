import { confirmInsurancePayment, createPaymentIntent } from "@/services/insurance.service"
import type { ConfirmInsurancePaymentData, CreatePaymentIntentData } from "@/types/insurance"
import { useMutation } from "@tanstack/react-query"

export const useCreatePaymentIntent = () => {
    return useMutation({
        mutationFn: (data: CreatePaymentIntentData) => createPaymentIntent(data)
    })
}

export const useConfirmInsurancePayment = () => {
    return useMutation({
        mutationFn: (data: ConfirmInsurancePaymentData) => confirmInsurancePayment(data.paymentIntentId),
    })
}