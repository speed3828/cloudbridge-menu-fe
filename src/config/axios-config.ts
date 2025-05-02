'use client';

import axios, { AxiosResponse } from 'axios';

// 이전 버전 axios에서는 AxiosError 인터페이스가 명시적으로 제공되지 않을 수 있어 임의로 정의
interface AxiosErrorResponse {
  data?: any;
  status?: number;
  statusText?: string;
  headers?: Record<string, string>;
  config?: any;
}

interface AxiosErrorInterface {
  message: string;
  name?: string;
  code?: string;
  config?: any;
  request?: any;
  response?: AxiosErrorResponse;
  isAxiosError?: boolean;
}

// Request ID 및 영어 오류 메시지 필터링 함수
const sanitizeErrorMessage = (message: string): string => {
  if (!message) return '알 수 없는 오류가 발생했습니다.';
  
  // Request ID 부분이 포함된 메시지 처리
  if (message.includes('Request ID:')) {
    return '서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.';
  }
  
  // 네트워크 관련 영어 에러 메시지 처리
  if (message.includes('Connection failed') || 
      message.includes('check your internet connection') ||
      message.includes('Network Error') ||
      message.includes('VPN')) {
    return '서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.';
  }
  
  return message;
};

// axios 전역 설정
export function configureAxios(): void {
  // 응답 인터셉터 설정
  // @ts-ignore: TypeScript에서 axios의 interceptors 속성을 인식하지 못하는 문제를 우회
  axios.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    (error: AxiosErrorInterface): Promise<never> => {
      // 에러 메시지 정리
      if (error.message) {
        error.message = sanitizeErrorMessage(error.message);
      }
      
      // 에러 객체에 response가 있고 data에 message가 있는 경우
      if (error.response?.data && typeof error.response.data === 'object' && error.response.data !== null) {
        const data = error.response.data as Record<string, any>;
        if ('message' in data && typeof data.message === 'string') {
          data.message = sanitizeErrorMessage(data.message);
        }
      }
      
      return Promise.reject(error);
    }
  );
}

// 클라이언트 측에서 즉시 설정 적용
if (typeof window !== 'undefined') {
  configureAxios();
} 