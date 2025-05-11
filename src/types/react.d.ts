// React type definitions

import * as React from 'react';

// jsx-runtime에 대한 타입 정의 추가
declare module 'react/jsx-runtime' {
  export namespace JSX {
    interface Element extends React.ReactElement<any, any> {}
    interface ElementClass extends React.Component<any> {
      render(): React.ReactNode;
    }
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
    type: React.ElementType,
    props: any,
    key?: React.Key | null | undefined
  ): React.ReactElement;
  
  export function jsxs(
    type: React.ElementType, 
    props: any, 
    key?: React.Key | null | undefined
  ): React.ReactElement;
}

declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> {}
    interface ElementClass extends React.Component<any> {
      render(): React.ReactNode;
    }
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

  namespace React {
    interface FormEvent<T = Element> extends SyntheticEvent<T> {
      target: EventTarget & T;
    }

    interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
      target: EventTarget & T;
    }

    interface SyntheticEvent<T = Element, E = Event> {
      bubbles: boolean;
      cancelable: boolean;
      currentTarget: EventTarget & T;
      defaultPrevented: boolean;
      eventPhase: number;
      isTrusted: boolean;
      nativeEvent: E;
      preventDefault(): void;
      stopPropagation(): void;
      target: EventTarget & T;
      timeStamp: number;
      type: string;
    }

    type FC<P = {}> = FunctionComponent<P>;
    interface FunctionComponent<P = {}> {
      (props: P & { children?: React.ReactNode }): React.ReactElement | null;
      displayName?: string;
    }
  }
}

declare module 'react' {
  export type HTMLAttributes<T> = React.HTMLAttributes<T>;
  export type ReactNode = React.ReactNode;
  export type Component<P = {}, S = {}> = React.Component<P, S>;
  export type ErrorInfo = React.ErrorInfo;
  export type FC<P = {}> = React.FC<P>;
  export type CSSProperties = React.CSSProperties;
  export type MouseEvent<T = Element> = React.MouseEvent<T>;
  export type ChangeEvent<T = Element> = React.ChangeEvent<T>;
  export type FormEvent<T = Element> = React.FormEvent<T>;
  export type Suspense = React.Suspense;
  
  export const useState: typeof React.useState;
  export const useEffect: typeof React.useEffect;
  export const useCallback: typeof React.useCallback;
  export const useMemo: typeof React.useMemo;
  export const useRef: typeof React.useRef;
  export const useContext: typeof React.useContext;
  export const useReducer: typeof React.useReducer;
  export const useLayoutEffect: typeof React.useLayoutEffect;

  export interface FormEvent<T = Element> extends SyntheticEvent<T> {
    target: EventTarget & T;
  }

  export interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
    target: EventTarget & T;
  }

  export interface SyntheticEvent<T = Element, E = Event> {
    bubbles: boolean;
    cancelable: boolean;
    currentTarget: EventTarget & T;
    defaultPrevented: boolean;
    eventPhase: number;
    isTrusted: boolean;
    nativeEvent: E;
    preventDefault(): void;
    stopPropagation(): void;
    target: EventTarget & T;
    timeStamp: number;
    type: string;
  }
}

// React와 관련된 타입 선언을 보완하는 파일

// 이 파일은 TypeScript가 React 모듈을 import React from 'react' 형태로
// 가져올 수 있도록 하는 보조 선언입니다.
declare module 'react' {}

// react-error-boundary와 관련된 타입 확장
declare module 'react-error-boundary' {
  import * as React from 'react';

  export interface FallbackProps {
    error: Error;
    resetErrorBoundary: (...args: any[]) => void;
  }

  export interface ErrorBoundaryProps {
    fallback?: React.ReactNode;
    fallbackRender?: (props: FallbackProps) => React.ReactNode;
    FallbackComponent?: React.ComponentType<FallbackProps>;
    onError?: (error: Error, info: { componentStack: string }) => void;
    onReset?: (...args: any[]) => void;
    resetKeys?: any[];
    onResetKeysChange?: (prevResetKeys: any[] | undefined, resetKeys: any[] | undefined) => void;
    children?: React.ReactNode;
  }

  // 기존 class 정의 대신 함수형 컴포넌트로 정의
  export const ErrorBoundary: React.FC<ErrorBoundaryProps>;
} 