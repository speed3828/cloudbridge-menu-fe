import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiRequestConfig, ApiResponse, ApiError } from '@/types/api';
import { addCSRFToken, handleCSRFError } from '@/lib/api/csrf';

// @ts-ignore: Ignore the process error
const API_TIMEOUT = Number(process.env.API_TIMEOUT) || 10000;
// @ts-ignore: Ignore the process error
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// @ts-ignore: Ignore the axios.create error
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config: ApiRequestConfig) => {
    if (config.skipAuth) {
      return config;
    }

    // 헤더가 없으면 초기화
    if (!config.headers) {
      config.headers = {};
    }

    // JWT 토큰이 있다면 헤더에 추가
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('jwt='))
      ?.split('=')[1];

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // CSRF 토큰 추가
    return addCSRFToken(config);
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => response,
  (error: any) => {
    // CSRF 에러 처리
    handleCSRFError(error);

    if (error.response) {
      const apiError: ApiError = {
        status: error.response.status,
        message: error.response.data?.message || '알 수 없는 오류가 발생했습니다.',
        errors: error.response.data?.errors,
      };

      // 서버 응답이 있는 경우
      switch (error.response.status) {
        case 401:
          // 인증 에러 처리
          window.location.href = '/login';
          break;
        case 403:
          // 권한 에러 처리
          console.error('접근 권한이 없습니다.');
          break;
        case 404:
          // 리소스 없음
          console.error('요청한 리소스를 찾을 수 없습니다.');
          break;
        case 500:
          // 서버 에러
          console.error('서버 오류가 발생했습니다.');
          break;
        default:
          console.error(apiError.message);
      }
      return Promise.reject(apiError);
    } else if (error.request) {
      // 요청은 보냈지만 응답이 없는 경우
      const apiError: ApiError = {
        status: 0,
        message: '서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.',
      };
      console.error(apiError.message);
      return Promise.reject(apiError);
    } else {
      // 요청 설정 중 에러가 발생한 경우
      const apiError: ApiError = {
        status: 0,
        message: '네트워크 연결 상태를 확인해주세요.',
      };
      console.error(apiError.message);
      return Promise.reject(apiError);
    }
  }
); 