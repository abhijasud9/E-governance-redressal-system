import { useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

import { ToastContext } from './ToastContextObject';

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type, exiting: false }]);
        setTimeout(() => {
            setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, 300);
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 300);
    }, []);

    const toast = {
        success: (msg) => addToast(msg, 'success'),
        error: (msg) => addToast(msg, 'error'),
        info: (msg) => addToast(msg, 'info'),
    };

    const icons = {
        success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
        error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
        info: <Info className="w-5 h-5 text-primary-600 shrink-0" />,
    };

    const styles = {
        success: 'toast-success',
        error: 'toast-error',
        info: 'toast-info',
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div className="fixed top-6 right-6 z-[9999] space-y-3 pointer-events-none">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`${styles[t.type]} pointer-events-auto ${t.exiting ? 'animate-toast-out' : ''}`}
                    >
                        {icons[t.type]}
                        <span className="text-sm font-semibold flex-1">{t.message}</span>
                        <button
                            onClick={() => removeToast(t.id)}
                            className="p-1 rounded-lg hover:bg-black/5 transition-colors shrink-0"
                        >
                            <X className="w-4 h-4 opacity-50" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

