import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { io as ioClient, type Socket } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";

type Toast = {
    id: string;
    title?: string;
    description?: string;
    type?: "info" | "success" | "error" | "warning";
    duration?: number;
};

type ToastContextType = {
    toasts: Toast[];
    showToast: (toast: Omit<Toast, "id">) => string;
    removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const { user } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const showToast = useCallback((toast: Omit<Toast, "id">) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const t: Toast = { id, duration: 3000, ...toast };
        setToasts(prev => [...prev, t]);
        if (t.duration && t.duration > 0) {
            setTimeout(() => removeToast(id), t.duration);
        }
        return id;
    }, [removeToast]);

    useEffect(() => {
        const s = ioClient("http://localhost:3001");
        setSocket(s);

        s.on("connect", () => {
            if (user && user.id) {
                s.emit('identify', user.id);
            }
        });

        s.on('notificacio', (data: any) => {
            const title = data.titol || 'Notificació';
            const msg = data.missatge || '';
            showToast({ type: data.tipus || 'info', title, description: msg });
            try {
                const ev = new CustomEvent('new-notificacio', { detail: data });
                window.dispatchEvent(ev as any);
            } catch (e) {
            }
        });

        s.on('proposta-acceptada', () => {
            try {
                const ev = new CustomEvent('proposta-acceptada', {});
                window.dispatchEvent(ev as any);
            } catch (e) {
            }
        });

        s.on('proposta-rebutjada', () => {
            try {
                const ev = new CustomEvent('proposta-rebutjada', {});
                window.dispatchEvent(ev as any);
            } catch (e) {
            }
        });

        return () => {
            s.disconnect();
        };
    }, [user]);

    return (
        <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
            {children}
            <div aria-live="polite" className="fixed top-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map(t => (
                    <div key={t.id} className={`max-w-sm w-full rounded-lg shadow-xl p-4 text-sm border backdrop-blur-none ${t.type === 'success'
                        ? 'bg-green-100 dark:bg-green-900 border-green-500 dark:border-green-500 text-green-900 dark:text-green-100'
                        : t.type === 'error'
                            ? 'bg-red-100 dark:bg-red-900 border-red-500 dark:border-red-500 text-red-900 dark:text-red-100'
                            : t.type === 'warning'
                                ? 'bg-yellow-100 dark:bg-yellow-900 border-yellow-500 dark:border-yellow-500 text-yellow-900 dark:text-yellow-100'
                                : 'bg-white dark:bg-zinc-800 border-blue-500 dark:border-blue-400 text-gray-900 dark:text-gray-100'
                        }`}>
                        {t.title && <div className="font-semibold">{t.title}</div>}
                        {t.description && <div className="text-xs mt-1">{t.description}</div>}
                        <div className="flex justify-end mt-2">
                            <button onClick={() => removeToast(t.id)} className="text-xs text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium">Tancar</button>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");
    return ctx;
};

export default ToastProvider;
