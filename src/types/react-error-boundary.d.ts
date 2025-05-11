import * as React from 'react';

declare module 'react-error-boundary' {
  export interface FallbackProps {
    error: Error;
    resetErrorBoundary: (...args: any[]) => void;
  }

  export interface ErrorBoundaryProps {
    fallback?: React.ReactNode;
    fallbackRender?: (props: FallbackProps) => React.ReactNode;
    FallbackComponent?: React.ComponentType<FallbackProps>;
    onError?: (error: Error, info: { componentStack: string }) => void;
    onReset?: (...args: any[]) => void;
    resetKeys?: any[];
    onResetKeysChange?: (prevResetKeys: any[] | undefined, resetKeys: any[] | undefined) => void;
    children?: React.ReactNode;
  }

  // 함수형 컴포넌트로 정의
  export const ErrorBoundary: React.ComponentType<ErrorBoundaryProps>;
} 