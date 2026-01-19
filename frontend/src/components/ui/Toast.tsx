import React, { createContext, useCallback, useContext, useState } from "react";

type Toast = {
    id: string;
    title?: string;
    description?: string;
    type?: "info" | "success" | "error" | "warning";
    duration?: number; // ms
};

type ToastContextType = {
    toasts: Toast[];
    showToast: (toast: Omit<Toast, "id">) => string;
    removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const showToast = useCallback((toast: Omit<Toast, "id">) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const t: Toast = { id, duration: 4000, ...toast };
        setToasts(prev => [...prev, t]);
        if (t.duration && t.duration > 0) {
            setTimeout(() => removeToast(id), t.duration);
        }
        return id;
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
            {children}
            <div aria-live="polite" className="fixed top-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map(t => (
                    <div key={t.id} className={`max-w-sm w-full rounded-md shadow-lg p-3 text-sm border ${t.type === 'success' ? 'bg-green-50 border-green-400' : t.type === 'error' ? 'bg-red-50 border-red-400' : 'bg-white border-gray-200'}`}>
                        {t.title && <div className="font-medium">{t.title}</div>}
                        {t.description && <div className="text-xs mt-1">{t.description}</div>}
                        <div className="flex justify-end mt-2">
                            <button onClick={() => removeToast(t.id)} className="text-xs text-gray-500 hover:text-gray-800">Tancar</button>
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
