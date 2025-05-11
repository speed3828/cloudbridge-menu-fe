'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ApiErrorHandler } from '@/lib/api/error';
import { useToast } from '@/hooks/useToast';

interface QueryErrorHandlerProps {
  children: React.ReactNode;
}

// Create a context-aware QueryErrorHandler
const QueryErrorHandler: React.FC<QueryErrorHandlerProps> = ({ children }) => {
  const toast = useToast();
  
  // Global query error handler
  const handleError = (error: unknown) => {
    // Log all errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[Query Error]:', error);
    }
    
    // Show toast notifications for API and network errors
    if (ApiErrorHandler.isApiError(error) || ApiErrorHandler.isNetworkError(error)) {
      toast.error(ApiErrorHandler.getErrorMessage(error));
    }
  };
  
  // Create the query client inside the component to access the toast context
  const queryClient = React.useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          // Don't retry on client errors (4xx)
          if (ApiErrorHandler.isApiError(error) && ApiErrorHandler.getHttpStatus(error) < 500) {
            return false;
          }
          // Retry server errors and network errors a maximum of 3 times
          return failureCount < 3;
        },
        onError: handleError,
      },
      mutations: {
        onError: handleError,
      },
    },
  }), [toast]);
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
};

// Export the QueryProvider that uses the context-aware QueryErrorHandler
export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryErrorHandler>
      {children}
    </QueryErrorHandler>
  );
} 