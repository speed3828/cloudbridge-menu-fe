/**
 * React 및 Next.js 모듈 타입 선언
 */

// React 타입 선언
declare module 'react' {
  import * as React from 'react';
  
  // React 핵심 타입
  export type ReactNode = 
    | React.ReactElement
    | string
    | number
    | boolean
    | null
    | undefined
    | React.ReactNodeArray;
  
  export type ReactNodeArray = Array<ReactNode>;
  
  // React Hooks
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: readonly any[]): void;
  export function useContext<T>(context: React.Context<T>): T;
  export function useReducer<R extends React.Reducer<any, any>, I>(
    reducer: R,
    initialArg: I,
    init?: (arg: I) => React.ReducerState<R>
  ): [React.ReducerState<R>, React.Dispatch<React.ReducerAction<R>>];
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: readonly any[]): T;
  export function useMemo<T>(factory: () => T, deps: readonly any[]): T;
  export function useRef<T = any>(initialValue: T): React.MutableRefObject<T>;
  export function useLayoutEffect(effect: React.EffectCallback, deps?: readonly any[]): void;
  
  // React 인터페이스 및 타입
  export interface RefObject<T> {
    readonly current: T | null;
  }
  
  export interface MutableRefObject<T> {
    current: T;
  }
  
  export type Reducer<S, A> = (prevState: S, action: A) => S;
  export type ReducerState<R extends Reducer<any, any>> = R extends Reducer<infer S, any> ? S : never;
  export type ReducerAction<R extends Reducer<any, any>> = R extends Reducer<any, infer A> ? A : never;
  export type Dispatch<A> = (value: A) => void;
  export type EffectCallback = () => void | (() => void);
  
  // 기본 React 내보내기
  export = React;
  export as namespace React;
}

// Next.js 타입 선언
declare module 'next' {
  import React from 'react';
  export type NextPage<P = {}, IP = P> = React.ComponentType<P> & {
    getInitialProps?: (context: any) => IP | Promise<IP>;
  };
  
  export interface NextPageContext {
    req?: any;
    res?: any;
    pathname: string;
    query: any;
    asPath: string;
    err?: Error;
  }
  
  export interface AppProps {
    Component: React.ComponentType<any>;
    pageProps: any;
    router: any;
  }
  
  // 기본 Next 내보내기
  import next = require('next');
  export = next;
  export as namespace next;
}

// Next.js Head 컴포넌트
declare module 'next/head' {
  import React from 'react';
  export default class Head extends React.Component<{
    children?: React.ReactNode;
  }> {}
  
  import Head = require('next/head');
  export = Head;
  export as namespace Head;
}

// Next.js Link 컴포넌트
declare module 'next/link' {
  import React from 'react';
  
  export interface LinkProps {
    href: string;
    as?: string;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
    legacyBehavior?: boolean;
    children?: React.ReactNode;
    className?: string;
    target?: string;
  }

  const Link: React.ForwardRefExoticComponent<
    LinkProps & React.RefAttributes<HTMLAnchorElement>
  >;
  
  export default Link;
  
  import link = require('next/link');
  export = link;
  export as namespace link;
}

// Next.js Router
declare module 'next/router' {
  export const useRouter: () => {
    query: Record<string, string | string[]>;
    pathname: string;
    asPath: string;
    push: (url: string, as?: string) => Promise<boolean>;
    replace: (url: string, as?: string) => Promise<boolean>;
    back: () => void;
    prefetch: (url: string) => Promise<void>;
    events: {
      on: (event: string, callback: (...args: any[]) => void) => void;
      off: (event: string, callback: (...args: any[]) => void) => void;
    };
  };
  
  import router = require('next/router');
  export = router;
  export as namespace router;
} 