import { useEffect, useMemo, useRef, useState } from 'react';
import { Bell, Check, CheckCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useGetMyNotifications } from '@/queries/notifications.queries';
import { useMarkAllNotificationsAsRead, useMarkNotificationAsRead } from '@/mutations/notifications.mutations';
import type { AppNotification } from '@/types/notifications';
import { useQueryClient } from '@tanstack/react-query';
import { getNotificationsEcho, refreshNotificationsEchoAuth } from '@/lib/notificationsEcho';

const MAX_VISIBLE = 8;
const COLLAPSED_MESSAGE_CHARS = 190;

const urgencyStyleByLevel: Record<string, {
    container: string;
    urgencyBadge: string;
    messageText: string;
}> = {
    CRITICA: {
        container: 'border-red-300 bg-red-50/90 dark:border-red-700/60 dark:bg-red-950/30',
        urgencyBadge: 'bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-200',
        messageText: 'text-red-800/90 dark:text-red-100/90',
    },
    ALTA: {
        container: 'border-amber-300 bg-amber-50/90 dark:border-amber-700/60 dark:bg-amber-950/30',
        urgencyBadge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-200',
        messageText: 'text-amber-800/90 dark:text-amber-100/90',
    },
    NORMAL: {
        container: 'border-blue-300 bg-blue-50/90 dark:border-blue-700/60 dark:bg-blue-950/30',
        urgencyBadge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-200',
        messageText: 'text-blue-800/90 dark:text-blue-100/90',
    },
    BAJA: {
        container: 'border-emerald-300 bg-emerald-50/90 dark:border-emerald-700/60 dark:bg-emerald-950/30',
        urgencyBadge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200',
        messageText: 'text-emerald-800/90 dark:text-emerald-100/90',
    },
};

const normalizeUrgency = (urgencia: string | null | undefined): keyof typeof urgencyStyleByLevel => {
    const value = String(urgencia ?? '').trim().toUpperCase();

    if (value === 'CRITICA') return 'CRITICA';
    if (value === 'ALTA') return 'ALTA';
    if (value === 'BAJA') return 'BAJA';

    return 'NORMAL';
};

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

const stripMarkdownDecoration = (text: string): string =>
    text
        .replace(/\*\*/g, '')
        .replace(/__/g, '')
        .replace(/`/g, '')
        .replace(/\*/g, '')
        .trim();

const getNotificationMessage = (notification: AppNotification): string => {
    const rawGenerated = (getGeneratedPreview(notification) ?? '').replace(/\r\n/g, '\n').trim();

    if (rawGenerated === '') {
        const fallback = stripMarkdownDecoration(notification.suceso);
        return fallback !== '' ? fallback : 'Sin mensaje generado todavia.';
    }

    return stripMarkdownDecoration(rawGenerated)
        .replace(/^mensaje\s*:\s*/i, '')
        .trim();
};

const parseRealtimeEvent = (payload: unknown): { action: string; notification: AppNotification } | null => {
    if (!payload || typeof payload !== 'object') {
        return null;
    }

    const envelope = payload as Record<string, unknown>;
    const rawNotification = envelope.notification && typeof envelope.notification === 'object'
        ? (envelope.notification as Record<string, unknown>)
        : envelope;

    const id = String(rawNotification.id ?? '').trim();
    if (id === '') {
        return null;
    }

    const userId = rawNotification.userId ?? rawNotification.user_id;
    const rawData = rawNotification.data;

    const normalized: AppNotification = {
        id,
        userId: userId === undefined || userId === null ? null : String(userId),
        suceso: String(rawNotification.suceso ?? ''),
        status: String(rawNotification.status ?? 'PENDENT'),
        tone: String(rawNotification.tone ?? 'PROFESIONAL'),
        urgencia: String(rawNotification.urgencia ?? 'NORMAL'),
        llegit: Boolean(rawNotification.llegit),
        channels: Array.isArray(rawNotification.channels)
            ? rawNotification.channels.map((channel) => String(channel))
            : [],
        data: rawData && typeof rawData === 'object' && !Array.isArray(rawData)
            ? (rawData as Record<string, unknown>)
            : {},
        createdAt: rawNotification.createdAt ? String(rawNotification.createdAt) : null,
        updatedAt: rawNotification.updatedAt ? String(rawNotification.updatedAt) : null,
    };

    return {
        action: String(rawNotification.action ?? envelope.action ?? 'updated').toLowerCase(),
        notification: normalized,
    };
};

const sortNotifications = (items: AppNotification[]): AppNotification[] =>
    [...items].sort((a, b) => {
        const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bDate - aDate;
    });

const upsertNotification = (
    current: AppNotification[],
    incoming: AppNotification,
    action: string,
): AppNotification[] => {
    const index = current.findIndex((item) => item.id === incoming.id);

    if (index === -1) {
        return sortNotifications([incoming, ...current]);
    }

    const next = [...current];
    const previous = next[index];

    next[index] = {
        ...previous,
        ...incoming,
        llegit: action === 'read' ? true : incoming.llegit,
        data: {
            ...(previous.data ?? {}),
            ...(incoming.data ?? {}),
        },
    };

    return sortNotifications(next);
};

export function NotificationBell() {
    const { isAuthenticated, user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [expandedMessages, setExpandedMessages] = useState<Record<string, boolean>>({});
    const panelRef = useRef<HTMLDivElement | null>(null);
    const queryClient = useQueryClient();

    const { data: notifications = [], isLoading } = useGetMyNotifications(isAuthenticated);
    const markOneMutation = useMarkNotificationAsRead();
    const markAllMutation = useMarkAllNotificationsAsRead();

    const orderedNotifications = useMemo(() => sortNotifications(notifications), [notifications]);

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

    useEffect(() => {
        if (!isAuthenticated || !user?.id) {
            return;
        }

        const echo = getNotificationsEcho();
        if (!echo) {
            return;
        }

        refreshNotificationsEchoAuth();

        const channel = echo.private(`user.${user.id}`);
        const eventName = '.ai.notification';

        const onRealtimeNotification = (eventPayload: unknown) => {
            const parsed = parseRealtimeEvent(eventPayload);
            if (!parsed) {
                return;
            }

            queryClient.setQueryData<AppNotification[]>(['notifications', 'me'], (current = []) =>
                upsertNotification(current, parsed.notification, parsed.action),
            );
        };

        channel.listen(eventName, onRealtimeNotification);

        return () => {
            channel.stopListening(eventName);
            echo.leave(`user.${user.id}`);
        };
    }, [isAuthenticated, queryClient, user?.id]);

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

    const toggleMessageExpanded = (notificationId: string) => {
        setExpandedMessages((previous) => ({
            ...previous,
            [notificationId]: !previous[notificationId],
        }));
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
                <div className="absolute right-0 z-50 mt-2 w-[min(92vw,430px)] rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-900">
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
                            {orderedNotifications.slice(0, MAX_VISIBLE).map((notification) => {
                                const urgency = normalizeUrgency(notification.urgencia);
                                const message = getNotificationMessage(notification);
                                const isExpanded = Boolean(expandedMessages[notification.id]);
                                const shouldShowToggle = message.length > COLLAPSED_MESSAGE_CHARS || message.includes('\n');

                                return (
                                    <div
                                        key={notification.id}
                                        className={`rounded-xl border p-3.5 transition-all ${urgencyStyleByLevel[urgency].container} ${notification.llegit ? 'opacity-70' : ''}`}
                                    >
                                        <div className="mb-1 flex items-start justify-between gap-3">
                                            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${urgencyStyleByLevel[urgency].urgencyBadge}`}>
                                                {urgency}
                                            </span>
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

                                        <div className="space-y-2">
                                            <div className="rounded-md border border-black/5 bg-white/55 p-2.5 dark:border-white/10 dark:bg-slate-900/30">
                                                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                                    Mensaje
                                                </p>
                                                <p className={`${isExpanded ? 'whitespace-pre-wrap' : 'line-clamp-3'} text-xs leading-relaxed ${urgencyStyleByLevel[urgency].messageText}`}>
                                                    {message}
                                                </p>

                                                {shouldShowToggle && (
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleMessageExpanded(notification.id)}
                                                        className="mt-1 text-[11px] font-semibold text-slate-700 underline-offset-2 hover:underline dark:text-slate-200"
                                                    >
                                                        {isExpanded ? 'Mostrar menos' : 'Mostrar todo el mensaje'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                                            <span className="text-slate-500">
                                                {notification.createdAt
                                                    ? new Date(notification.createdAt).toLocaleString('ca-ES')
                                                    : 'Data no disponible'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}

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