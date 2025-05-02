'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose?: () => void;
}

function Toast({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}: ToastProps): JSX.Element | null {
  const [isVisible, setIsVisible] = React.useState(true);
  const toastRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  // Define classes for each type
  const typeClass = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
    warning: 'bg-yellow-500 text-white',
  }[type];

  return (
    <div
      ref={toastRef}
      className={cn(
        'fixed bottom-4 right-4 p-4 rounded-lg shadow-lg max-w-md transform transition-all duration-300 ease-in-out',
        typeClass
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

export { Toast }; 