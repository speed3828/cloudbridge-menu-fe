import { AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const CSRF_TOKEN_COOKIE = 'csrf_token';
const CSRF_HEADER = 'X-CSRF-Token';

export function addCSRFToken(config: AxiosRequestConfig): AxiosRequestConfig {
  const csrfToken = Cookies.get(CSRF_TOKEN_COOKIE);
  
  if (csrfToken) {
    config.headers = {
      ...config.headers,
      [CSRF_HEADER]: csrfToken,
    };
  }

  return config;
}

export function handleCSRFError(error: any): Promise<any> {
  if (error.response?.status === 403 && error.response?.data?.message === 'CSRF 토큰이 유효하지 않습니다.') {
    // CSRF 토큰이 유효하지 않은 경우 페이지 새로고침
    window.location.reload();
  }
  return Promise.reject(error);
} 