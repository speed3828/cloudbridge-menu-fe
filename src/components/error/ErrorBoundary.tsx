import React from 'react';
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary';
import { ApiRequestError, isNetworkError } from '@/lib/api/errors';
import { ERROR_MESSAGES } from '@/constants/errorMessages';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showNotification?: boolean;
}

/**
 * 기본 에러 메시지를 가져오는 유틸리티 함수
 */
function getErrorMessage(error: Error | null): string {
  if (!error) return ERROR_MESSAGES.UNKNOWN_ERROR;

  if (error instanceof ApiRequestError) {
    return error.message;
  }

  if (isNetworkError(error)) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  return error.message || ERROR_MESSAGES.UNKNOWN_ERROR;
}

/**
 * 오류 발생 시 표시되는 기본 fallback UI
 */
function DefaultErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="error-boundary p-6 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center mb-4">
        <svg
          className="w-6 h-6 text-red-600 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h2 className="text-lg font-semibold text-red-800">
          오류가 발생했습니다
        </h2>
      </div>
      <p className="text-sm text-red-600 mb-4">
        {getErrorMessage(error)}
      </p>
      <div className="flex space-x-4">
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          페이지 새로고침
        </button>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        >
          이전 페이지로 이동
        </button>
      </div>
    </div>
  );
}

/**
 * 오류 경계 컴포넌트 (함수형으로 변경)
 */
function ErrorBoundary({ children, fallback, onError, showNotification = true }: ErrorBoundaryProps) {
  // 커스텀 fallback 처리 함수
  const renderFallback = React.useCallback(
    (props: FallbackProps) => {
      if (fallback) {
        return <>{fallback}</>;
      }
      return <DefaultErrorFallback {...props} />;
    },
    [fallback]
  );

  // 오류 처리 함수
  const handleError = React.useCallback(
    (error: Error, info: { componentStack: string }) => {
      // 사용자 정의 에러 핸들러 호출
      if (onError) {
        onError(error, info as React.ErrorInfo);
      }

      // 개발 환경에서 에러 로깅
      if (process.env.NODE_ENV === 'development') {
        console.error('[ErrorBoundary]:', error);
        console.error('[ErrorInfo]:', info);
      }
    },
    [onError]
  );

  return (
    <ReactErrorBoundary 
      fallbackRender={renderFallback}
      onError={handleError}
    >
      {children}
    </ReactErrorBoundary>
  );
}

export default ErrorBoundary; 