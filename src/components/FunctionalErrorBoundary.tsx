'use client';

import React, { useEffect, useState } from 'react';
import { Button } from './ui/Button';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * 기능적 오류 경계 컴포넌트
 * 클래스 기반 ErrorBoundary와 호환되는 함수형 컴포넌트 구현
 */
function FunctionalErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // 전역 에러 핸들러를 설정하여 처리되지 않은 오류를 캐치합니다
    const errorHandler = (event: ErrorEvent) => {
      event.preventDefault();
      setHasError(true);
      setError(event.error || new Error(event.message));
    };

    // 오류 이벤트 수신기를 등록합니다
    window.addEventListener('error', errorHandler);
    
    // 컴포넌트가 언마운트될 때 이벤트 리스너를 정리합니다
    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  // 오류 상태 초기화
  const handleReset = () => {
    setHasError(false);
    setError(null);
  };

  // 페이지 새로고침
  const handleReload = () => {
    window.location.reload();
  };

  // 오류가 발생한 경우 대체 UI를 렌더링합니다
  if (hasError) {
    // 사용자 정의 fallback이 제공된 경우 해당 UI를 사용합니다
    if (fallback) {
      return <>{fallback}</>;
    }

    // 기본 오류 UI
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">오류가 발생했습니다</h2>
          <div className="mb-4">
            <p className="text-gray-600 mb-2">
              {error?.message || '알 수 없는 오류가 발생했습니다.'}
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="default"
              onClick={handleReset}
              className="flex-1"
            >
              다시 시도
            </Button>
            <Button
              variant="outline"
              onClick={handleReload}
              className="flex-1"
            >
              페이지 새로고침
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 오류가 없는 경우 자식 컴포넌트를 정상적으로 렌더링합니다
  return <>{children}</>;
}

export default FunctionalErrorBoundary; 