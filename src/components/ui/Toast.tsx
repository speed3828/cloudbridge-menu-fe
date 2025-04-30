'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose?: () => void;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ message, type = 'info', duration = 3000, onClose }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true);

    React.useEffect(() => {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!isVisible) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'fixed bottom-4 right-4 p-4 rounded-lg shadow-lg max-w-md transform transition-all duration-300 ease-in-out',
          {
            'bg-green-500 text-white': type === 'success',
            'bg-red-500 text-white': type === 'error',
            'bg-blue-500 text-white': type === 'info',
            'bg-yellow-500 text-white': type === 'warning',
          }
        )}
      >
        <div className="flex items-center">
          <span className="flex-1">{message}</span>
          <button
            onClick={() => {
              setIsVisible(false);
              onClose?.();
            }}
            className="ml-4 text-white hover:text-gray-200"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }
);

Toast.displayName = 'Toast';

export { Toast }; 