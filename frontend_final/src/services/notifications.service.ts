import { laravel } from "@/api/axios";
import { authHeader } from "@/services/shared/auth-header";
import { extractArray, unwrapApiData } from "@/services/shared/response-utils";
import type { ApiListResponse, ApiResponse, AppNotification } from "@/types/notifications";

export const getMyNotifications = async (): Promise<AppNotification[]> => {
    const res = await laravel.get<ApiListResponse<AppNotification>>('/api/notifications/me', {
        headers: authHeader(),
    });

    return extractArray<AppNotification>(res.data);
};

export const getNotificationsByUser = async (userId: string): Promise<AppNotification[]> => {
    const res = await laravel.get<ApiListResponse<AppNotification>>(`/api/notifications/user/${userId}`, {
        headers: authHeader(),
    });

    return extractArray<AppNotification>(res.data);
};

export const markNotificationAsRead = async (id: string): Promise<AppNotification> => {
    const res = await laravel.patch<ApiResponse<AppNotification>>(`/api/notifications/${id}/read`, {}, {
        headers: authHeader(),
    });

    return unwrapApiData<AppNotification>(res.data);
};
