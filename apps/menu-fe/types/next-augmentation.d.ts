import * as React from 'react';

// Next.js 확장 타입 정의
declare module 'next' {
  // NextPage 타입 정의
  export type NextPage<P = {}, IP = P> = React.ComponentType<P> & {
    getInitialProps?: (context: any) => IP | Promise<IP>;
  };
  
  // Metadata 타입 정의
  export interface Metadata {
    title?: string | null;
    description?: string | null;
    [key: string]: any;
  }
} 