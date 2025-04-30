import { NextRequest as OriginalNextRequest, NextResponse as OriginalNextResponse } from 'next/server';

declare module 'next/server' {
  interface NextRequest extends OriginalNextRequest {
    cookies: {
      get(name: string): { name: string; value: string } | undefined;
    };
    headers: Headers;
    method: string;
  }

  interface NextResponse extends OriginalNextResponse {
    cookies: {
      set(name: string, value: string, options?: {
        domain?: string;
        path?: string;
        secure?: boolean;
        sameSite?: 'strict' | 'lax' | 'none';
        httpOnly?: boolean;
      }): void;
      set(options: {
        name: string;
        value: string;
        domain?: string;
        path?: string;
        secure?: boolean;
        sameSite?: 'strict' | 'lax' | 'none';
        httpOnly?: boolean;
      }): void;
    };
  }
} 