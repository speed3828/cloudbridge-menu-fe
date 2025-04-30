'use client';

import { useCallback } from 'react';
import { ApiError } from '@/types/api';

export function useErrorHandler() {
  const handleError = useCallback((error: unknown) => {
    if (error instanceof Error) {
      // 일반 에러 처리
      console.error('Error:', error.message);
      return error.message;
    }

    if (typeof error === 'object' && error !== null && 'status' in error) {
      const apiError = error as ApiError;
      
      // API 에러 처리
      switch (apiError.status) {
        case 401:
          // 인증 에러
          window.location.href = '/login';
          return '로그인이 필요합니다.';
        case 403:
          // 권한 에러
          return '접근 권한이 없습니다.';
        case 404:
          // 리소스 없음
          return '요청한 리소스를 찾을 수 없습니다.';
        case 500:
          // 서버 에러
          return '서버 오류가 발생했습니다.';
        default:
          return apiError.message || '알 수 없는 오류가 발생했습니다.';
      }
    }

    return '알 수 없는 오류가 발생했습니다.';
  }, []);

  return { handleError };
} 