'use client';

import React from 'react';
import { Button } from './ui/Button';

/**
 * 에러 바운더리 컴포넌트
 * 
 * @typedef {Object} ErrorBoundaryProps
 * @property {React.ReactNode} children - Child components to render
 * @property {React.ReactNode} [fallback] - Optional fallback UI to render when an error occurs
 */

/**
 * 에러 바운더리를 함수형 컴포넌트로 구현하는 대신, 
 * 이 파일에서는 클래스 컴포넌트가 동작할 수 있도록 하기 위한 기능만 구현합니다.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  /**
   * React lifecycle method to capture errors during rendering
   * @param {Error} error - The error that was thrown
   * @returns {Object} - New state with error information
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error, errorInfo: null };
  }

  /**
   * React lifecycle method to handle errors during rendering
   * @param {Error} error - The error that was thrown
   * @param {Object} errorInfo - Information about where the error occurred
   */
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  /**
   * Reset the error state to attempt recovery
   */
  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  /**
   * Reload the page to recover from the error
   */
  handleReload = () => {
    window.location.reload();
  };

  render() {
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