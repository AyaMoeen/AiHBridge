// src/hooks/use-toast.ts
import { useState } from 'react';

export interface Toast {
    id: string;
    title?: string;
    description?: string;
    variant?: 'default' | 'destructive';
    duration?: number;
}

interface ToastState {
    toasts: Toast[];
}

let toastCount = 0;

export function useToast() {
    const [state, setState] = useState<ToastState>({ toasts: [] });

    const toast = ({ title, description, variant = 'default', duration = 5000 }: Omit<Toast, 'id'>) => {
        const id = (++toastCount).toString();
        const newToast: Toast = { id, title, description, variant, duration };

        setState((prevState) => ({
            toasts: [...prevState.toasts, newToast],
        }));

        // Auto-dismiss after duration
        setTimeout(() => {
            dismiss(id);
        }, duration);

        return id;
    };

    const dismiss = (toastId: string) => {
        setState((prevState) => ({
            toasts: prevState.toasts.filter((t) => t.id !== toastId),
        }));
    };

    return {
        toast,
        dismiss,
        toasts: state.toasts,
    };
}