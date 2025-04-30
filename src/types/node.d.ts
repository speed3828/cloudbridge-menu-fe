declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    API_TIMEOUT?: string;
    NEXT_PUBLIC_API_URL?: string;
    NEXT_PUBLIC_API_BASE?: string;
    COOKIE_DOMAIN?: string;
  }

  export interface Timeout {}
} 