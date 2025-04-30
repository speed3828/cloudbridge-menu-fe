import { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message: string;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

export interface ApiRequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
  headers?: Record<string, string>;
}

export interface ApiInterceptorConfig {
  request?: (config: ApiRequestConfig) => ApiRequestConfig | Promise<ApiRequestConfig>;
  response?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
  error?: (error: any) => any;
}

export interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
} 