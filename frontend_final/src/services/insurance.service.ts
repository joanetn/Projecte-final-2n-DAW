import { laravel } from "@/api/axios"
import { authHeader } from '@/services/shared/auth-header'
import { extractArray } from '@/services/shared/response-utils'
import type {
    ConfirmInsurancePaymentResponse,
    CreatePaymentIntentData,
    CreatePaymentIntentResponse,
    Insurance,
} from "@/types/insurance"

export const getInsurances = async (): Promise<Insurance[]> => {
    const res = await laravel.get<{ success: boolean; data: Insurance[] }>("/api/seguros", {
        headers: authHeader(),
    })
    return extractArray<Insurance>(res.data)
}

export const createPaymentIntent = async (data: CreatePaymentIntentData): Promise<CreatePaymentIntentResponse> => {
    const res = await laravel.post<CreatePaymentIntentResponse>(`/api/seguros/create-payment-intent`, data, {
        headers: authHeader(),
    })
    return res.data
}

export const confirmInsurancePayment = async (paymentIntentId: string): Promise<ConfirmInsurancePaymentResponse> => {
    const res = await laravel.post<ConfirmInsurancePaymentResponse>(`/api/seguros/confirm-payment`, {
        paymentIntentId,
    }, {
        headers: authHeader(),
    })

    return res.data
}