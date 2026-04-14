import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markNotificationAsRead } from '@/services/notifications.service';

export const useMarkNotificationAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => markNotificationAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', 'me'] });
            queryClient.invalidateQueries({ queryKey: ['notifications', 'user'] });
        },
    });
};

export const useMarkAllNotificationsAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (ids: string[]) => {
            await Promise.all(ids.map((id) => markNotificationAsRead(id)));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', 'me'] });
            queryClient.invalidateQueries({ queryKey: ['notifications', 'user'] });
        },
    });
};