import { useQuery } from '@tanstack/react-query';
import { getMyNotifications, getNotificationsByUser } from '@/services/notifications.service';
import type { AppNotification } from '@/types/notifications';

export const useGetMyNotifications = (enabled: boolean = true) =>
    useQuery<AppNotification[]>({
        queryKey: ['notifications', 'me'],
        queryFn: getMyNotifications,
        enabled,
        staleTime: 1_000,
        refetchInterval: enabled ? 3_000 : false,
        refetchIntervalInBackground: true,
        refetchOnWindowFocus: true,
    });

export const useGetNotificationsByUser = (userId: string | null) =>
    useQuery<AppNotification[]>({
        queryKey: ['notifications', 'user', userId],
        queryFn: () => getNotificationsByUser(userId!),
        enabled: !!userId,
        staleTime: 1_000,
        refetchInterval: userId ? 3_000 : false,
        refetchIntervalInBackground: true,
        refetchOnWindowFocus: true,
    });