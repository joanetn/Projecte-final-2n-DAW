export interface CreatePaymentIntentData {
    mesos?: number;
    preu?: number;
}

export interface Insurance {
    id: string;
    usuariId?: string | null;
    dataExpiracio?: string | null;
    pagat: boolean;
    stripe_payment_intent_id?: string | null;
    preu?: number | null;
    mesos?: number;
    isActive?: boolean;
    createdAt?: string | null;
    updatedAt?: string | null;
}

export interface CreatePaymentIntentResponse {
    success: boolean;
    message?: string;
    insuranceId: string;
    clientSecret: string;
}

export interface ConfirmInsurancePaymentData {
    paymentIntentId: string;
}

export interface ConfirmInsurancePaymentResponse {
    success: boolean;
    message?: string;
}