/// <reference types="next" />
/// <reference types="react" />

// React의 타입 정의
declare module 'react' {
  interface ReactElement<P = any, T = any> {}
  interface ReactNode {}
  type ElementType = any;
  type ComponentType<P = {}> = any;
  type Key = string | number;
}

// JSX 런타임에 대한 타입 정의
declare module 'react/jsx-runtime' {
  export namespace JSX {
    interface Element {}
    interface ElementClass {}
    interface ElementAttributesProperty {
      props: {};
    }
    interface ElementChildrenAttribute {
      children: {};
    }
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
  
  export function jsx(
    type: any,
    props: any,
    key?: string | number | null
  ): any;
  
  export function jsxs(
    type: any, 
    props: any, 
    key?: string | number | null
  ): any;
}

// Next.js 메타데이터 타입 정의
declare module 'next' {
  export interface Metadata {
    title?: string | null;
    description?: string | null;
    [key: string]: any;
  }
  
  export type NextPage<P = {}, IP = P> = React.ComponentType<P> & {
    getInitialProps?: (context: any) => IP | Promise<IP>;
  };
}

// 전역 JSX 네임스페이스 정의
declare global {
  namespace JSX {
    interface Element {}
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
} 