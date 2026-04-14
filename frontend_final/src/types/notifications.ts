export interface AppNotification {
    id: string;
    userId?: string | null;
    suceso: string;
    status: string;
    tone: string;
    urgencia: string;
    llegit: boolean;
    channels: string[];
    data: Record<string, unknown>;
    createdAt?: string | null;
    updatedAt?: string | null;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

export interface ApiListResponse<T> {
    success: boolean;
    data: T[];
}