'use client';

import { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export type ToastType = 'success' | 'error' | 'loading';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

function ToastComponent({ toast, onDismiss }: ToastProps) {
  const bgColor = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    loading: 'bg-blue-50 border-blue-200'
  }[toast.type];

  const textColor = {
    success: 'text-green-800',
    error: 'text-red-800',
    loading: 'text-blue-800'
  }[toast.type];

  return (
    <div className={`${bgColor} ${textColor} p-4 rounded-lg border shadow-sm flex items-center justify-between`}>
      <div className="flex items-center space-x-3">
        {toast.type === 'loading' && (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
        )}
        <p>{toast.message}</p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 hover:bg-white rounded-full transition-colors"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const timeouts = toasts.map(toast => {
      if (toast.type !== 'loading') {
        return setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== toast.id));
        }, 5000);
      }
    });

    return () => timeouts.forEach(timeout => timeout && clearTimeout(timeout));
  }, [toasts]);

  function addToast(message: string, type: ToastType) {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, message, type }]);
    return id;
  }

  function updateToast(id: string, message: string, type: ToastType) {
    setToasts(prev => prev.map(toast => 
      toast.id === id ? { ...toast, message, type } : toast
    ));
  }

  function dismissToast(id: string) {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }

  // Expose methods globally
  useEffect(() => {
    (window as any).toast = {
      show: addToast,
      update: updateToast,
      dismiss: dismissToast
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map(toast => (
        <ToastComponent
          key={toast.id}
          toast={toast}
          onDismiss={dismissToast}
        />
      ))}
    </div>
  );
} 