'use client';

import { ReactNode } from 'react';
// @ts-ignore: Temporarily ignore missing exports
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 에러 메시지에서 Request ID 부분을 제거하는 함수
const sanitizeErrorMessage = (message: string): string => {
  if (!message) return '알 수 없는 오류가 발생했습니다.';
  
  // Request ID 부분 제거
  if (message.includes('Request ID:')) {
    return '서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.';
  }
  
  // 영어 오류 메시지 한글로 변환
  if (message.includes('Connection failed') || 
      message.includes('check your internet connection') ||
      message.includes('VPN')) {
    return '서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.';
  }
  
  return message;
};

// 기본 쿼리 클라이언트 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      onError: (error: unknown) => {
        // 에러 처리 로직
        console.error('Query error:', error);
      },
    },
    mutations: {
      onError: (error: unknown) => {
        // 에러 처리 로직
        console.error('Mutation error:', error);
      },
    },
  },
});

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
} 