import React from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { ApiErrorHandler } from '@/lib/api/error';

interface FunctionalErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onReset?: () => void;
  onError?: (error: Error, info: { componentStack: string }) => void;
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
          onClick={resetErrorBoundary}
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}

/**
 * 함수형 컴포넌트에서 사용하기 쉬운 Error Boundary 래퍼
 */
export function FunctionalErrorBoundary({
  children,
  fallback,
  onReset,
  onError,
}: FunctionalErrorBoundaryProps) {
  // 커스텀 fallback이 있는 경우 처리하는 렌더링 함수
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
    <ErrorBoundary
      fallbackRender={renderFallback}
      onReset={onReset}
      onError={onError}
    >
      {children}
    </ErrorBoundary>
  );
}

export default FunctionalErrorBoundary; 