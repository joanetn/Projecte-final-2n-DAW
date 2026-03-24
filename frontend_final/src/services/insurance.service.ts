import { laravel } from "@/api/axios"
import type {
    ConfirmInsurancePaymentResponse,
    CreatePaymentIntentData,
    CreatePaymentIntentResponse,
    Insurance,
} from "@/types/insurance"

const authHeader = () => {
    const token = localStorage.getItem('accessToken')
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export const getInsurances = async (): Promise<Insurance[]> => {
    const res = await laravel.get<{ success: boolean; data: Insurance[] }>("/api/seguros", {
        headers: authHeader(),
    })
    return res.data.data
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