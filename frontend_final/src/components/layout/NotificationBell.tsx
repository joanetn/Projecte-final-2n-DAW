import { useEffect, useMemo, useRef, useState } from 'react';
import { Bell, Check, CheckCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useGetMyNotifications } from '@/queries/notifications.queries';
import { useMarkAllNotificationsAsRead, useMarkNotificationAsRead } from '@/mutations/notifications.mutations';
import type { AppNotification } from '@/types/notifications';

const MAX_VISIBLE = 8;

const getGeneratedPreview = (notification: AppNotification): string | null => {
    const payload = notification.data as { deliveries?: unknown };

    if (!Array.isArray(payload.deliveries)) {
        return null;
    }

    for (const delivery of payload.deliveries) {
        if (
            delivery &&
            typeof delivery === 'object' &&
            'message' in delivery &&
            typeof (delivery as { message: unknown }).message === 'string'
        ) {
            const message = (delivery as { message: string }).message.trim();
            if (message !== '') {
                return message;
            }
        }
    }

    return null;
};

export function NotificationBell() {
    const { isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement | null>(null);

    const { data: notifications = [], isLoading } = useGetMyNotifications(isAuthenticated);
    const markOneMutation = useMarkNotificationAsRead();
    const markAllMutation = useMarkAllNotificationsAsRead();

    const orderedNotifications = useMemo(
        () =>
            [...notifications].sort((a, b) => {
                const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return bDate - aDate;
            }),
        [notifications],
    );

    const unreadNotifications = useMemo(
        () => orderedNotifications.filter((notification) => !notification.llegit),
        [orderedNotifications],
    );

    const unreadCount = unreadNotifications.length;

    useEffect(() => {
        const handleOutside = (event: MouseEvent) => {
            if (!panelRef.current) return;

            if (!panelRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, []);

    if (!isAuthenticated) {
        return null;
    }

    const handleMarkAsRead = async (id: string) => {
        if (markOneMutation.isPending) return;
        await markOneMutation.mutateAsync(id);
    };

    const handleMarkAllAsRead = async () => {
        if (markAllMutation.isPending || unreadCount === 0) return;
        await markAllMutation.mutateAsync(unreadNotifications.map((notification) => notification.id));
    };

    return (
        <div className="relative" ref={panelRef}>
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="relative rounded-lg p-2 text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Notificaciones"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 z-50 mt-2 w-[360px] rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Notificaciones</h3>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleMarkAllAsRead}
                            disabled={markAllMutation.isPending || unreadCount === 0}
                            className="h-8 px-2 text-xs"
                        >
                            {markAllMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <CheckCheck className="mr-1 h-4 w-4" />
                                    Marcar todas
                                </>
                            )}
                        </Button>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-6 text-sm text-slate-500">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Cargando notificaciones...
                        </div>
                    ) : orderedNotifications.length === 0 ? (
                        <p className="py-6 text-center text-sm text-slate-500">No tienes notificaciones.</p>
                    ) : (
                        <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
                            {orderedNotifications.slice(0, MAX_VISIBLE).map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`rounded-lg border p-3 transition-colors ${notification.llegit
                                        ? 'border-slate-200 bg-slate-50/60 dark:border-slate-700 dark:bg-slate-800/40'
                                        : 'border-warm-200 bg-warm-50/70 dark:border-warm-700/40 dark:bg-warm-900/10'
                                        }`}
                                >
                                    <div className="mb-1 flex items-start justify-between gap-3">
                                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{notification.suceso}</p>
                                        {!notification.llegit && (
                                            <button
                                                type="button"
                                                onClick={() => handleMarkAsRead(notification.id)}
                                                className="rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-slate-100"
                                                aria-label="Marcar como leida"
                                            >
                                                {markOneMutation.isPending ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Check className="h-4 w-4" />
                                                )}
                                            </button>
                                        )}
                                    </div>

                                    {getGeneratedPreview(notification) && (
                                        <p className="mb-2 line-clamp-2 text-xs text-slate-600 dark:text-slate-300">
                                            {getGeneratedPreview(notification)}
                                        </p>
                                    )}

                                    <div className="flex flex-wrap items-center gap-2 text-xs">
                                        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                                            {notification.status}
                                        </span>
                                        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                                            {notification.urgencia}
                                        </span>
                                        <span className="text-slate-500">
                                            {notification.createdAt
                                                ? new Date(notification.createdAt).toLocaleString('ca-ES')
                                                : 'Data no disponible'}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {orderedNotifications.length > MAX_VISIBLE && (
                                <p className="pt-1 text-center text-xs text-slate-500">
                                    Mostrando {MAX_VISIBLE} de {orderedNotifications.length} notificaciones
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}