import React from 'react';
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary';
import { ApiErrorHandler } from '@/lib/api/error';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * 오류 발생 시 표시되는 기본 fallback UI
 */
function DefaultErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          죄송합니다. 오류가 발생했습니다.
        </h2>
        <p className="text-gray-600 mb-6">
          {ApiErrorHandler.getErrorMessage(error)}
        </p>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => window.location.reload()}
        >
          페이지 새로고침
        </button>
      </div>
    </div>
  );
}

/**
 * 오류 경계 컴포넌트 (함수형으로 변경)
 */
export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
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

  return (
    <ReactErrorBoundary fallbackRender={renderFallback}>
      {children}
    </ReactErrorBoundary>
  );
} 