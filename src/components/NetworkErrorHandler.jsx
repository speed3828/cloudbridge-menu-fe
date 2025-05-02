'use client';

import React, { useEffect } from 'react';
import { useToast } from '@/contexts/ToastContext';

/**
 * Network error handler component that intercepts and handles network-related errors
 * Provides user-friendly error messages for connection issues
 */
export function NetworkErrorHandler() {
  const { showToast } = useToast();

  useEffect(() => {
    // Save original handlers
    const originalOnError = window.onerror;
    const originalFetch = window.fetch;
    const originalOnUnhandledRejection = window.onunhandledrejection;
    
    // Define common network error patterns
    const networkErrorPatterns = [
      'Connection failed', 
      'check your internet connection',
      'VPN',
      'Request ID:',
      'Network Error',
      'Failed to fetch',
      'Unable to connect',
      'Connection timed out',
      'Network request failed'
    ];
    
    // Helper function to check if an error message is network-related
    const isNetworkError = (message) => {
      if (!message || typeof message !== 'string') return false;
      return networkErrorPatterns.some(pattern => message.includes(pattern));
    };
    
    // Handle the network error with a user-friendly message
    const handleNetworkError = (errorDetails) => {
      showToast('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.', 'error');
      console.error('Network error intercepted:', errorDetails);
      return true; // Mark as handled
    };

    // Global error handler
    window.onerror = (message, source, lineno, colno, error) => {
      if (isNetworkError(message)) {
        return handleNetworkError(message);
      }
      
      // Call original handler if not a network error
      if (originalOnError) {
        return originalOnError(message, source, lineno, colno, error);
      }
      
      return false;
    };
    
    // Unhandled promise rejection handler
    window.onunhandledrejection = (event) => {
      const errorMessage = event.reason?.message || String(event.reason);
      
      if (isNetworkError(errorMessage)) {
        handleNetworkError(event.reason);
        event.preventDefault();
        return;
      }
      
      // Call original handler if not a network error
      if (originalOnUnhandledRejection) {
        originalOnUnhandledRejection(event);
      }
    };
    
    // Override fetch to catch network errors
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        return response;
      } catch (error) {
        const errorMessage = error?.message || String(error);
        if (isNetworkError(errorMessage)) {
          handleNetworkError(error);
        }
        throw error; // Re-throw to not break error chains
      }
    };
    
    // Clean up by restoring original handlers
    return () => {
      window.onerror = originalOnError;
      window.fetch = originalFetch;
      window.onunhandledrejection = originalOnUnhandledRejection;
    };
  }, [showToast]);
  
  // This component doesn't render any UI
  return null;
}