'use client';

import * as React from 'react';
import { Button } from './ui/Button';

// Define prop and state types without relying on namespace
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: { componentStack: string } | null;
}

/**
 * 에러 바운더리 컴포넌트
 * 애플리케이션 내에서 발생하는 JavaScript 오류를 캐치하고 처리하는 컴포넌트
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { 
      hasError: true, 
      error, 
      errorInfo: null 
    };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ 
      hasError: true,
      error: error,
      errorInfo: errorInfo 
    });
  }

  handleReset = (): void => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-600 mb-4">오류가 발생했습니다</h2>
            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                {this.state.error?.message || '알 수 없는 오류가 발생했습니다.'}
              </p>
              {this.state.errorInfo && (
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-40">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>
            <div className="flex gap-4">
              <Button
                variant="default"
                onClick={this.handleReset}
                className="flex-1"
              >
                다시 시도
              </Button>
              <Button
                variant="outline"
                onClick={this.handleReload}
                className="flex-1"
              >
                페이지 새로고침
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 