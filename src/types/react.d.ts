// React와 ReactDOM 타입 정의
declare module 'react' {
  export = React;
  export as namespace React;
  
  namespace React {
    // 필요한 React 타입 정의
    interface FunctionComponent<P = {}> {
      (props: P, context?: any): ReactElement<any, any> | null;
      displayName?: string;
    }
    
    interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
      type: T;
      props: P;
      key: Key | null;
    }
    
    type Key = string | number;
    type JSXElementConstructor<P> = ((props: P) => ReactElement | null);
    
    // 기타 필요한 타입 정의
  }
}

declare module 'react-dom' {
  import * as React from 'react';
  
  function render(element: React.ReactElement, container: Element | null): void;
  function hydrate(element: React.ReactElement, container: Element | null): void;
  
  // 기타 필요한 타입 정의
  
  export = ReactDOM;
  export as namespace ReactDOM;
  
  namespace ReactDOM {
    function render(element: React.ReactElement, container: Element | null): void;
    function hydrate(element: React.ReactElement, container: Element | null): void;
  }
}

// React 모듈 재정의
declare module "react" {
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => (void | (() => void)), deps?: readonly any[]): void;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: readonly any[]): T;
  export function useMemo<T>(factory: () => T, deps: readonly any[]): T;
  export function useContext<T>(context: React.Context<T>): T;
  export function createContext<T>(defaultValue: T): React.Context<T>;
  export function forwardRef<T, P>(render: (props: P, ref: React.Ref<T>) => React.ReactElement | null): (props: P & { ref?: React.Ref<T> }) => React.ReactElement | null;
  export function memo<P>(component: React.ComponentType<P>): React.ComponentType<P>;

  export type ReactNode = React.ReactElement | string | number | boolean | null | undefined | readonly ReactNode[];
  export type ComponentType<P = {}> = React.Component<P> | React.FunctionComponent<P>;
  export type ReactElement = {
    type: any;
    props: any;
    key: string | null;
  };
  export type Ref<T> = { current: T | null } | ((instance: T | null) => void) | null;
  export interface Context<T> {
    Provider: React.ComponentType<{ value: T; children?: React.ReactNode }>;
    Consumer: React.ComponentType<{ children: (value: T) => React.ReactNode }>;
  }
} 