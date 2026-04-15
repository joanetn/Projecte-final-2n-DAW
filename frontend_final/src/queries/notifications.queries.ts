import { useQuery } from '@tanstack/react-query';
import { getMyNotifications, getNotificationsByUser } from '@/services/notifications.service';
import type { AppNotification } from '@/types/notifications';

export const useGetMyNotifications = (enabled: boolean = true) =>
    useQuery<AppNotification[]>({
        queryKey: ['notifications', 'me'],
        queryFn: getMyNotifications,
        enabled,
        staleTime: 5_000,
        refetchOnWindowFocus: true,
    });

export const useGetNotificationsByUser = (userId: string | null) =>
    useQuery<AppNotification[]>({
        queryKey: ['notifications', 'user', userId],
        queryFn: () => getNotificationsByUser(userId!),
        enabled: !!userId,
        staleTime: 5_000,
        refetchOnWindowFocus: true,
    });