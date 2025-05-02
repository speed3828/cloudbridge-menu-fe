// 전역 TypeScript 타입 선언

// Promise 타입 선언
interface Promise<T> {
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): Promise<TResult1 | TResult2>;
  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
  ): Promise<T | TResult>;
  finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}

// React 타입 확장
declare namespace React {
  interface FormEvent<T = Element> {
    preventDefault(): void;
    stopPropagation(): void;
    target: EventTarget & T;
  }

  interface ChangeEvent<T = Element> {
    preventDefault(): void;
    target: EventTarget & T & {
      name: string;
      value: string;
    };
  }

  interface FC<P = {}> {
    (props: P & { children?: React.ReactNode }): React.ReactElement | null;
    displayName?: string;
  }
}

// JSX 타입 확장
declare namespace JSX {
  interface Element {}
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// Node.js 프로세스 타입 선언
declare const process: {
  env: {
    NODE_ENV: 'development' | 'production' | 'test';
    COOKIE_DOMAIN?: string;
    [key: string]: string | undefined;
  };
}; 