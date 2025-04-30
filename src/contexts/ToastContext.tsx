'use client';

import * as React from 'react';
import { Toast } from '@/components/ui/Toast';

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = React.useState<{
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  } | null>(null);

  const showToast = React.useCallback(
    (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
      setToast({ message, type });
    },
    []
  );

  const handleClose = React.useCallback(() => {
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleClose}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
} 